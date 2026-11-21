const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("C:/Users/User/Documents/ChatGPT/个人简历/node_modules/playwright-core");

const outputDir = path.join(process.cwd(), "_review", "new-site");
fs.mkdirSync(outputDir, { recursive: true });

const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const baseUrl = "http://127.0.0.1:4173/";

async function waitForLoader(page) {
  await page.locator("#pageLoader.is-hidden").waitFor({ timeout: 5000 });
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(outputDir, name),
    fullPage: false,
    animations: "allow",
  });
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: edgePath,
  });

  const errors = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await waitForLoader(page);
  await screenshot(page, "desktop-00-step-1.png");

  await page.mouse.move(250, 700);
  await page.mouse.move(1100, 420, { steps: 32 });
  await page.waitForTimeout(180);
  await screenshot(page, "desktop-00b-water-trail.png");

  await page.mouse.move(720, 520);
  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(900);
  await screenshot(page, "desktop-01a-video-transition-1.png");
  await page.waitForTimeout(2500);
  await screenshot(page, "desktop-01b-pose-2.png");
  const afterFirst = await page.locator("#heroStageLabel").textContent();
  const firstTransitionDuration = await page
    .locator("#heroTransitionVideo")
    .evaluate((video) => video.duration);

  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(1000);
  await screenshot(page, "desktop-02-about.png");
  const afterAbout = await page.locator("#heroStageLabel").textContent();

  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(950);
  await screenshot(page, "desktop-03a-video-transition-2.png");
  await page.waitForTimeout(2700);
  await screenshot(page, "desktop-03b-pose-3.png");
  const afterSecond = await page.locator("#heroStageLabel").textContent();
  const secondTransitionDuration = await page
    .locator("#heroTransitionVideo")
    .evaluate((video) => video.duration);

  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(1000);
  await screenshot(page, "desktop-04-experience.png");
  const afterExperience = await page.locator("#heroStageLabel").textContent();

  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(1500);
  await screenshot(page, "desktop-05-work.png");
  const workScrollY = await page.evaluate(() => window.scrollY);

  await page.locator('[data-project="hebi"]').click();
  await page.waitForTimeout(900);
  await screenshot(page, "desktop-06-dialog.png");
  const dialogOpen = await page.locator("#projectDialog").evaluate((node) => node.open);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const nextProjectTitle = await page.locator("#projectDialogTitle").textContent();
  await page.locator("#dialogClose").click();
  await page.waitForTimeout(250);
  const dialogClosed = await page.locator("#projectDialog").evaluate((node) => !node.open);

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await mobileContext.newPage();
  mobile.on("pageerror", (error) => errors.push(`mobile pageerror: ${error.message}`));
  mobile.on("console", (message) => {
    if (message.type() === "error") errors.push(`mobile console: ${message.text()}`);
  });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await waitForLoader(mobile);
  await mobile.waitForTimeout(900);
  await mobile.touchscreen.tap(195, 520);
  await mobile.waitForTimeout(900);
  await screenshot(mobile, "mobile-01a-video-transition.png");
  await mobile.waitForFunction(
    () =>
      document.querySelector("#heroStageLabel")?.textContent === "01 / 05" &&
      document.querySelector("#heroTransitionVideo")?.paused,
    null,
    { timeout: 7000 },
  );
  await mobile.touchscreen.tap(195, 520);
  await mobile.waitForTimeout(1000);
  await screenshot(mobile, "mobile-02-about.png");
  const mobileAfterAbout = await mobile.locator("#heroStageLabel").textContent();

  console.log(
    JSON.stringify(
      {
        afterFirst,
        afterAbout,
        afterSecond,
        afterExperience,
        mobileAfterAbout,
        firstTransitionDuration,
        secondTransitionDuration,
        workScrollY,
        dialogOpen,
        dialogClosed,
        nextProjectTitle,
        errors,
      },
      null,
      2,
    ),
  );

  await mobileContext.close();
  await context.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
