const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const projectData = [
  {
    id: "hebi",
    title: "鹤壁数字沙盘",
    category: "CITY SHOWCASE / DIGITAL TERRAIN",
    year: "CLIENT FILM",
    description:
      "面向城市展厅的数字沙盘总归影片。以宏观城市视角串联城市格局、产业信息与规划内容，在有限时长里建立清楚的空间叙事。",
    role: "剪辑 / 调色 / 字幕 / 动效包装 / 成片交付",
    tools: "Premiere Pro · After Effects · DaVinci Resolve",
    delivery: "展厅数字沙盘 / 总归影片",
    cover: "/assets/site/projects/hebi.webp",
    video: "/assets/site/previews/hebi.mp4",
    icon: "rings",
    accent: "#58b8ff",
  },
  {
    id: "zhangjiang",
    title: "飞跃张江",
    category: "CITY FILM / AERIAL",
    year: "AERIAL FILM",
    description:
      "以航拍视角呈现张江科学城的城市尺度与建设节奏。从科学之门、双塔与城市路网中提取有方向感的镜头，让城市形象既有速度也有秩序。",
    role: "航拍素材组织 / 剪辑 / 调色 / 视觉节奏",
    tools: "Premiere Pro · DaVinci Resolve · After Effects",
    delivery: "城市形象片 / 航拍影像",
    cover: "/assets/site/projects/zhangjiang.webp",
    video: "/assets/site/previews/zhangjiang.mp4",
    icon: "tower",
    accent: "#78ebff",
  },
  {
    id: "tiaozi",
    title: "条子泥",
    category: "ECOLOGY / TOURISM",
    year: "2024 / ECO FILM",
    description:
      "围绕条子泥湿地自然地貌与四季景观展开的生态文旅影像。以天空、潮汐、植被和远处地平线组织节奏，让自然成为叙事主体。",
    role: "镜头筛选 / 叙事剪辑 / 调色 / 声音组织",
    tools: "Premiere Pro · DaVinci Resolve",
    delivery: "文旅宣传片 / 生态影像",
    cover: "/assets/site/projects/tiaozi.webp",
    video: "/assets/site/previews/tiaozi.mp4",
    icon: "wave",
    accent: "#ffd264",
  },
  {
    id: "changdu",
    title: "昌都",
    category: "CITY FILM / CULTURE",
    year: "CITY FILM",
    description:
      "城市展厅总归影片，以高原城市、地域文化和建设成果构成多层叙事。画面在宏大航拍与真实生活之间切换，兼顾信息完整与观看节奏。",
    role: "后期剪辑 / 视觉包装 / 音效 / 成片交付",
    tools: "Premiere Pro · After Effects · Audition",
    delivery: "城市展厅影片 / 文化宣传",
    cover: "/assets/site/projects/changdu.webp",
    video: "/assets/site/previews/changdu.mp4",
    icon: "compass",
    accent: "#ff8b68",
  },
  {
    id: "mangkang",
    title: "芒康",
    category: "TRAVEL / DOCUMENTARY",
    year: "TRAVEL FILM",
    description:
      "聚焦芒康自然与人文景观的文旅形象影片。通过地形、人物与地域色彩建立镜头之间的联系，在较长的空间跨度中保持统一的情绪线索。",
    role: "叙事剪辑 / 调色 / 字幕 / 动效包装",
    tools: "Premiere Pro · After Effects · DaVinci Resolve",
    delivery: "文旅形象片 / 展陈内容",
    cover: "/assets/site/projects/mangkang.webp",
    video: "/assets/site/previews/mangkang.mp4",
    icon: "mountain",
    accent: "#c29aff",
  },
  {
    id: "wanan",
    title: "万安",
    category: "EXHIBITION / CITY STORY",
    year: "EXHIBITION FILM",
    description:
      "结合航拍、实景与信息可视化的城市展馆影片。围绕展陈动线组织镜头，把历史、人文与城市发展内容压缩成清晰而连贯的视觉段落。",
    role: "剪辑 / 调色 / 信息动效 / 展陈视觉节奏",
    tools: "Premiere Pro · After Effects · DaVinci Resolve",
    delivery: "展馆影片 / 城市宣传",
    cover: "/assets/site/projects/wanan.webp",
    video: "/assets/site/previews/wanan.mp4",
    icon: "cube",
    accent: "#70efc6",
  },
];

const iconPaths = {
  rings:
    '<circle cx="32" cy="32" r="17"></circle><circle cx="32" cy="32" r="8"></circle><path d="M32 8v7M32 49v7M8 32h7M49 32h7"></path>',
  tower:
    '<path d="M18 49V23l14-9 14 9v26"></path><path d="M25 49V35h14v14M13 49h38M32 14V8"></path>',
  wave:
    '<path d="M8 40c8-9 16-9 24 0s16 9 24 0"></path><path d="M8 30c8-9 16-9 24 0s16 9 24 0"></path><path d="M8 50c8-9 16-9 24 0s16 9 24 0"></path>',
  compass:
    '<circle cx="32" cy="32" r="21"></circle><path d="m39 25-5 13-9 3 5-13z"></path>',
  mountain:
    '<path d="M7 48 25 18l10 17 7-10 15 23z"></path><path d="m18 31 7 4 6-8"></path><path d="M7 48h50"></path>',
  cube:
    '<path d="m32 7 20 11v26L32 57 12 44V18z"></path><path d="m12 18 20 12 20-12M32 30v27"></path>',
};

function renderProjects() {
  const field = document.querySelector("#projectGridField");
  field.innerHTML = projectData
    .map(
      (project, index) => `
        <button
          class="chroma-card"
          type="button"
          data-project="${project.id}"
          style="--accent: ${project.accent}; --item-index: ${index}"
          aria-label="打开项目：${project.title}"
        >
          <img class="chroma-card__image" src="${project.cover}" alt="${project.title}项目封面" loading="eager" />
          <span class="chroma-card__veil" aria-hidden="true"></span>
          <span class="chroma-card__glow" aria-hidden="true"></span>
          <span class="chroma-card__top">
            <span class="chroma-card__index">${String(index + 1).padStart(2, "0")} / 06</span>
            <span class="project-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64">${iconPaths[project.icon]}</svg>
            </span>
          </span>
          <span class="chroma-card__content">
            <span class="chroma-card__subtitle">${project.category}</span>
            <span class="chroma-card__title">${project.title}</span>
            <span class="chroma-card__meta">
              <span>${project.year}</span>
              <span>VIEW PROJECT ↗</span>
            </span>
          </span>
        </button>
      `,
    )
    .join("");
}

renderProjects();

class DepthText {
  constructor(root) {
    this.root = root;
    this.text = root.dataset.text || root.getAttribute("aria-label") || "";
    this.layerCount = 34;
    this.depth = 2.4;
    this.tilt = 7.5;
    this.orbitSpeed = 0.35;
    this.smoothing = 0.14;
    this.pointerActive = false;
    this.visible = false;
    this.currentX = -this.tilt;
    this.currentY = 0;
    this.targetX = -this.tilt;
    this.targetY = 0;
    this.lastTime = 0;
    this.frameId = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.build();
    this.bind();
    this.observe();
  }

  build() {
    const stage = document.createElement("span");
    stage.className = "depth-text__stage";
    stage.setAttribute("aria-hidden", "true");

    for (let index = 0; index < this.layerCount; index += 1) {
      const layer = document.createElement("span");
      layer.className = "depth-text__layer";
      layer.textContent = this.text;
      layer.style.setProperty("--layer-index", index);
      layer.style.setProperty("--layer-z", `${-(index + 1) * this.depth}px`);
      layer.style.opacity = String(0.34 + (index / this.layerCount) * 0.5);
      stage.append(layer);
    }

    const face = document.createElement("span");
    face.className = "depth-text__face";
    face.textContent = this.text;
    stage.append(face);
    this.stage = stage;
    this.root.append(stage);
  }

  bind() {
    this.root.addEventListener(
      "pointerenter",
      () => this.root.classList.add("is-hovering"),
      { passive: true },
    );
    this.root.addEventListener(
      "pointerleave",
      () => {
        this.pointerActive = false;
        this.root.classList.remove("is-hovering");
      },
      { passive: true },
    );
    this.root.addEventListener(
      "pointermove",
      (event) => {
        const rect = this.stage.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
        const relativeY = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
        this.pointerActive = true;
        this.targetY = relativeX * this.tilt * 1.25;
        this.targetX = -this.tilt + relativeY * this.tilt * 0.8;
      },
      { passive: true },
    );
  }

  observe() {
    if (!("IntersectionObserver" in window)) {
      this.setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => this.setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(this.root);
    this.observer = observer;
  }

  setVisible(visible) {
    if (visible === this.visible) return;
    this.visible = visible;
    this.root.classList.toggle("is-visible", visible);
    if (visible && !this.frameId) {
      this.lastTime = performance.now();
      this.frameId = requestAnimationFrame((time) => this.animate(time));
    } else if (!visible && this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  }

  animate(time) {
    if (!this.visible) {
      this.frameId = 0;
      return;
    }

    const delta = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (!this.pointerActive && !this.reducedMotion) {
      this.targetY = Math.sin(time * 0.001 * this.orbitSpeed) * 5.2;
      this.targetX = -this.tilt + Math.cos(time * 0.00082 * this.orbitSpeed) * 1.4;
    }

    const easing = 1 - Math.pow(1 - this.smoothing, delta * 60);
    this.currentX += (this.targetX - this.currentX) * easing;
    this.currentY += (this.targetY - this.currentY) * easing;
    this.stage.style.setProperty("--rotate-x", `${this.currentX.toFixed(3)}deg`);
    this.stage.style.setProperty("--rotate-y", `${this.currentY.toFixed(3)}deg`);
    this.frameId = requestAnimationFrame((nextTime) => this.animate(nextTime));
  }
}

class ChromaGrid {
  constructor(root) {
    this.root = root;
    this.field = root.querySelector("#projectGridField");
    this.cards = [...root.querySelectorAll(".chroma-card")];
    this.radius = Number(root.dataset.radius || 260);
    this.frameId = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.bind();
    this.observe();
  }

  bind() {
    this.field.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        cancelAnimationFrame(this.frameId);
        this.frameId = requestAnimationFrame(() => this.revealAt(event.clientX, event.clientY));
      },
      { passive: true },
    );

    this.root.addEventListener(
      "pointerleave",
      () => {
        cancelAnimationFrame(this.frameId);
        this.frameId = requestAnimationFrame(() => this.reset());
      },
      { passive: true },
    );
  }

  observe() {
    if (!("IntersectionObserver" in window)) {
      this.setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => this.setVisible(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(this.root);
    this.observer = observer;
  }

  setVisible(visible) {
    this.root.classList.toggle("is-visible", visible);
  }

  revealAt(clientX, clientY) {
    this.cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      const proximity = this.reducedMotion ? 1 : Math.max(0, 1 - distance / this.radius);
      const localX = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
      const localY = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;

      card.style.setProperty("--chroma", proximity.toFixed(3));
      card.style.setProperty("--local-x", `${localX.toFixed(1)}%`);
      card.style.setProperty("--local-y", `${localY.toFixed(1)}%`);
    });
  }

  reset() {
    this.cards.forEach((card) => {
      card.style.removeProperty("--chroma");
      card.style.removeProperty("--local-x");
      card.style.removeProperty("--local-y");
    });
  }
}

new ChromaGrid(document.querySelector("#projectGrid"));

class WaterTrail {
  constructor(canvas, host) {
    this.canvas = canvas;
    this.host = host;
    this.context = canvas.getContext("2d");
    this.points = [];
    this.ripples = [];
    this.lastPoint = null;
    this.rippleOrigin = null;
    this.lastRipple = 0;
    this.frameId = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.render = this.render.bind(this);

    this.resize();
    this.bind();
  }

  bind() {
    this.host.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "mouse") this.addPoint(event.clientX, event.clientY, 0.8);
      },
      { passive: true },
    );

    this.host.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType !== "mouse") return;
        this.addPoint(event.clientX, event.clientY, 1.3);
        const point = this.toLocal(event.clientX, event.clientY);
        this.ripples.push({
          x: point.x,
          y: point.y,
          start: performance.now(),
          strength: 1.45,
          angle: 0,
          phase: performance.now() * 0.0021,
        });
        this.rippleOrigin = { ...point, time: performance.now() };
      },
      { passive: true },
    );

    window.addEventListener("resize", () => this.resize(), { passive: true });
  }

  toLocal(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  addPoint(clientX, clientY, strength) {
    if (this.reducedMotion) return;
    const point = this.toLocal(clientX, clientY);
    const now = performance.now();
    const previous = this.lastPoint;
    const distance = previous
      ? Math.hypot(point.x - previous.x, point.y - previous.y)
      : 0;
    const velocity = previous ? distance / Math.max(8, now - previous.time) : 0.2;
    const angle = previous ? Math.atan2(point.y - previous.y, point.x - previous.x) : 0;

    this.lastPoint = { ...point, time: now };
    this.points.push({
      ...point,
      time: now,
      strength: clamp(strength * (0.45 + velocity * 7), 0.35, 1.5),
    });
    this.points = this.points.slice(-110);
    const rippleDistance = this.rippleOrigin
      ? Math.hypot(point.x - this.rippleOrigin.x, point.y - this.rippleOrigin.y)
      : Infinity;

    if (rippleDistance > 15 && now - this.lastRipple > 58) {
      this.ripples.push({
        x: point.x,
        y: point.y,
        start: now,
        strength: clamp(0.34 + velocity * 4.8, 0.38, 1.22),
        angle,
        phase: now * 0.0021,
      });
      this.lastRipple = now;
      this.rippleOrigin = { ...point, time: now };
    }

    this.start();
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(this.canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(this.canvas.clientHeight * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  start() {
    if (this.reducedMotion || this.frameId) return;
    this.frameId = requestAnimationFrame(this.render);
  }

  render(now) {
    const { context } = this;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    this.points = this.points.filter((point) => now - point.time < 980);
    this.ripples = this.ripples.filter((ripple) => now - ripple.start < 1650);
    if (this.ripples.length > 22) this.ripples = this.ripples.slice(-22);
    if (!this.points.length && !this.ripples.length) {
      this.frameId = 0;
      return;
    }

    context.save();
    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";
    context.lineJoin = "round";

    const newestPoint = this.points[this.points.length - 1];
    if (newestPoint && now - newestPoint.time < 620) {
      const energy = 1 - (now - newestPoint.time) / 620;
      const glow = context.createRadialGradient(
        newestPoint.x,
        newestPoint.y,
        0,
        newestPoint.x,
        newestPoint.y,
        96,
      );
      glow.addColorStop(0, `rgba(201, 248, 255, ${0.13 * energy})`);
      glow.addColorStop(0.38, `rgba(73, 164, 255, ${0.07 * energy})`);
      glow.addColorStop(1, "rgba(34, 102, 224, 0)");
      context.fillStyle = glow;
      context.fillRect(newestPoint.x - 96, newestPoint.y - 96, 192, 192);
    }

    for (const ripple of this.ripples) {
      const age = (now - ripple.start) / 1000;
      const progress = clamp(age / 1.62);
      const eased = 1 - Math.pow(1 - progress, 2.25);
      const radius = 10 + eased * 106;
      const alpha = Math.pow(1 - progress, 1.65) * 0.42 * ripple.strength;

      context.save();
      context.translate(ripple.x, ripple.y);
      context.rotate(ripple.angle);
      context.shadowColor = "rgba(91, 184, 255, 0.46)";
      context.shadowBlur = 8;

      for (let band = 0; band < 3; band += 1) {
        const bandRadius = radius * (1 + band * 0.16);
        context.beginPath();
        for (let step = 0; step <= 64; step += 1) {
          const angle = (step / 64) * Math.PI * 2;
          const wobble =
            1 +
            Math.sin(angle * 3 + progress * 8 + ripple.phase + band * 0.7) *
              (0.018 + 0.024 * (1 - progress));
          const x = Math.cos(angle) * bandRadius * wobble;
          const y = Math.sin(angle) * bandRadius * 0.54 * wobble;
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle =
          band === 1
            ? `rgba(104, 194, 255, ${alpha * 0.34})`
            : `rgba(178, 232, 255, ${alpha * (0.28 - band * 0.055)})`;
        context.lineWidth = band === 1 ? 1.35 : 1;
        context.stroke();
      }

      const lens = context.createRadialGradient(0, 0, 0, 0, 0, radius * 0.92);
      lens.addColorStop(0, `rgba(166, 235, 255, ${alpha * 0.1})`);
      lens.addColorStop(0.5, `rgba(57, 146, 255, ${alpha * 0.07})`);
      lens.addColorStop(1, "rgba(40, 110, 255, 0)");
      context.fillStyle = lens;
      context.beginPath();
      context.ellipse(0, 0, radius * 0.95, radius * 0.52, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    context.restore();
    this.frameId = requestAnimationFrame(this.render);
  }
}

const heroSticky = document.querySelector(".hero-sticky");
const heroImages = [...document.querySelectorAll("#heroImages img")];
const heroVideos = [...document.querySelectorAll(".hero-transition-video")];
const transitionVideos = {
  first: document.querySelector("#heroTransitionFirst"),
  second: document.querySelector("#heroTransitionSecond"),
};
const heroStageLabel = document.querySelector("#heroStageLabel");
const heroHint = document.querySelector("#heroHint");
const progressDots = [...document.querySelectorAll(".hero-progress__dot")];
const introPanel = document.querySelector("#introPanel");
const experiencePanel = document.querySelector("#experiencePanel");
const openingCopy = document.querySelector(".hero-copy--opening");
const workSection = document.querySelector("#work");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

new WaterTrail(document.querySelector("#waterTrailCanvas"), heroSticky);

let heroStep = 0;
let heroBusy = false;
let touchStart = null;
let suppressClickUntil = 0;
let wheelGestureConsumed = false;
let wheelEndTimer = 0;

const hints = [
  "一次滚动或点击，进入下一幕",
  "再次滚动或点击，查看个人简介",
  "再次滚动或点击，切换到第三个姿态",
  "再次滚动或点击，查看项目经历",
  "再次滚动或点击，进入作品层",
];

function setHeroPose(poseIndex) {
  heroImages.forEach((image) => {
    image.classList.toggle("is-active", Number(image.dataset.pose) === poseIndex);
  });
}

function setHeroStep(step) {
  heroStep = step;
  heroSticky.dataset.step = String(step);
  heroStageLabel.textContent = `${String(step).padStart(2, "0")} / 05`;
  openingCopy.setAttribute("aria-hidden", step === 0 ? "false" : "true");
  introPanel.setAttribute("aria-hidden", step === 2 ? "false" : "true");
  experiencePanel.setAttribute("aria-hidden", step === 4 ? "false" : "true");
  progressDots.forEach((dot, index) => dot.classList.toggle("is-active", index === Math.min(step, 4)));
  heroHint.textContent = hints[Math.min(step, hints.length - 1)];
}

function waitForVideoEnd(video) {
  return new Promise((resolve) => {
    let finished = false;
    let timer;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      video.removeEventListener("ended", finish);
      resolve();
    };
    video.addEventListener("ended", finish, { once: true });
    const duration = Number.isFinite(video.duration) ? video.duration : 2.4;
    timer = window.setTimeout(finish, Math.max(2100, duration * 1000 + 260));
  });
}

async function playPoseTransition({ targetStep, endPose }) {
  if (heroBusy) return;
  heroBusy = true;
  heroSticky.classList.add("is-transitioning");

  if (reduceMotion) {
    setHeroStep(targetStep);
    setHeroPose(endPose);
    await wait(160);
    heroSticky.classList.remove("is-transitioning");
    heroBusy = false;
    return;
  }

  const video = targetStep === 1 ? transitionVideos.first : transitionVideos.second;
  if (!video || video.readyState < 2) {
    setHeroStep(targetStep);
    setHeroPose(endPose);
    await wait(820);
    heroSticky.classList.remove("is-transitioning");
    heroBusy = false;
    return;
  }

  heroVideos.forEach((item) => item.classList.remove("is-current"));
  video.currentTime = 0;
  video.classList.add("is-current");
  setHeroStep(targetStep);
  heroSticky.classList.add("is-motion-playing");

  try {
    await video.play();
  } catch {
    video.classList.remove("is-current");
    heroSticky.classList.remove("is-motion-playing");
    setHeroPose(endPose);
    await wait(820);
    heroSticky.classList.remove("is-transitioning");
    heroBusy = false;
    return;
  }

  await waitForVideoEnd(video);
  heroSticky.classList.add("is-settling-pose");
  setHeroPose(endPose);
  heroSticky.classList.remove("is-motion-playing");
  await wait(360);
  video.pause();
  video.classList.remove("is-current");
  heroSticky.classList.remove("is-settling-pose");
  heroSticky.classList.remove("is-transitioning");
  heroBusy = false;
}

async function revealInformation(targetStep, duration = 760) {
  if (heroBusy) return;
  heroBusy = true;
  heroSticky.classList.add("is-transitioning");
  setHeroStep(targetStep);
  await wait(duration);
  heroSticky.classList.remove("is-transitioning");
  heroBusy = false;
}

async function enterWorkLayer() {
  if (heroBusy) return;
  heroBusy = true;
  setHeroStep(5);
  await wait(160);
  window.scrollTo({
    top: workSection.offsetTop,
    behavior: reduceMotion ? "auto" : "smooth",
  });
  await wait(reduceMotion ? 100 : 1100);
  heroBusy = false;
}

async function goForward() {
  if (heroBusy || document.querySelector("#projectDialog").open) return;

  if (heroStep === 0) {
    await playPoseTransition({
      targetStep: 1,
      endPose: 1,
    });
    return;
  }

  if (heroStep === 1) {
    await revealInformation(2);
    return;
  }

  if (heroStep === 2) {
    await playPoseTransition({
      targetStep: 3,
      endPose: 2,
    });
    return;
  }

  if (heroStep === 3) {
    await revealInformation(4);
    return;
  }

  if (heroStep === 4) {
    await enterWorkLayer();
  }
}

function goBackward() {
  if (heroBusy) return;
  if (heroStep <= 0) return;

  if (heroStep === 4) {
    setHeroStep(3);
    setHeroPose(2);
    return;
  }
  if (heroStep === 3) {
    setHeroStep(2);
    setHeroPose(1);
    return;
  }
  if (heroStep === 2) {
    setHeroStep(1);
    setHeroPose(1);
    return;
  }
  if (heroStep === 1) {
    setHeroStep(0);
    setHeroPose(0);
  }
}

function resetHero() {
  heroVideos.forEach((video) => {
    video.pause();
    video.classList.remove("is-current");
  });
  heroSticky.classList.remove("is-motion-playing", "is-settling-pose", "is-transitioning");
  setHeroPose(0);
  setHeroStep(0);
  heroBusy = false;
}

function isHeroInteractionActive() {
  return window.scrollY <= 2 && heroStep < 5;
}

window.addEventListener(
  "wheel",
  (event) => {
    if (!isHeroInteractionActive()) return;
    if (Math.abs(event.deltaY) < 2 && Math.abs(event.deltaX) < 2) return;
    event.preventDefault();
    window.clearTimeout(wheelEndTimer);
    wheelEndTimer = window.setTimeout(() => {
      wheelGestureConsumed = false;
    }, 180);
    if (heroBusy) return;
    if (wheelGestureConsumed) return;
    wheelGestureConsumed = true;

    if (event.deltaY > 0 || event.deltaX > 0) {
      void goForward();
    } else {
      goBackward();
    }
  },
  { passive: false },
);

heroSticky.addEventListener("click", (event) => {
  if (heroBusy || performance.now() < suppressClickUntil) return;
  if (event.target.closest("a, button")) return;
  void goForward();
});

heroSticky.addEventListener(
  "touchstart",
  (event) => {
    if (event.target.closest("a, button")) {
      touchStart = null;
      return;
    }
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  },
  { passive: true },
);

heroSticky.addEventListener(
  "touchmove",
  (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      event.preventDefault();
    }
  },
  { passive: false },
);

heroSticky.addEventListener(
  "touchend",
  (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;
    suppressClickUntil = performance.now() + 500;
    if (Math.abs(deltaY) < 46 || Math.abs(deltaY) < Math.abs(deltaX)) {
      void goForward();
      return;
    }
    if (deltaY < 0) void goForward();
    else goBackward();
  },
  { passive: true },
);

progressDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    if (heroBusy) return;
    const target = Number(dot.dataset.step);
    if (target === heroStep) return;
    const pose = target <= 1 ? 0 : target <= 2 ? 1 : 2;
    setHeroPose(pose);
    setHeroStep(target);
  });
});

window.addEventListener(
  "keydown",
  (event) => {
    if (document.querySelector("#projectDialog").open || !isHeroInteractionActive()) return;
    if (["ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      void goForward();
    }
    if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      goBackward();
    }
  },
  { passive: false },
);

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY <= 1 && heroStep === 5 && !heroBusy) {
      window.setTimeout(() => {
        if (window.scrollY <= 1 && !heroBusy) {
          setHeroPose(0);
          setHeroStep(0);
        }
      }, 180);
    }
  },
  { passive: true },
);

const projectDialog = document.querySelector("#projectDialog");
const dialogClose = document.querySelector("#dialogClose");
const dialogScroll = document.querySelector("#dialogScroll");
const projectVideo = document.querySelector("#projectVideo");
const projectStill = document.querySelector("#projectStill");
const projectTitle = document.querySelector("#projectDialogTitle");
const projectCategory = document.querySelector("#projectCategory");
const projectYear = document.querySelector("#projectYear");
const projectDescription = document.querySelector("#projectDescription");
const projectRole = document.querySelector("#projectRole");
const projectTools = document.querySelector("#projectTools");
const projectDelivery = document.querySelector("#projectDelivery");
const projectPrev = document.querySelector("#projectPrev");
const projectNext = document.querySelector("#projectNext");
let activeProjectIndex = 0;
let lastProjectTrigger = null;

function fillProject(index) {
  activeProjectIndex = (index + projectData.length) % projectData.length;
  const project = projectData[activeProjectIndex];
  projectTitle.textContent = project.title;
  projectCategory.textContent = project.category;
  projectYear.textContent = project.year;
  projectDescription.textContent = project.description;
  projectRole.textContent = project.role;
  projectTools.textContent = project.tools;
  projectDelivery.textContent = project.delivery;
  projectVideo.pause();
  projectVideo.src = project.video;
  projectVideo.poster = project.cover;
  projectVideo.load();
  projectStill.src = project.cover;
  projectStill.alt = `${project.title}项目画面`;
  dialogScroll.scrollTop = 0;
}

function openProject(id, trigger) {
  const index = projectData.findIndex((project) => project.id === id);
  if (index < 0) return;
  lastProjectTrigger = trigger;
  fillProject(index);
  document.body.classList.add("modal-open");
  projectDialog.showModal();
  dialogClose.focus({ preventScroll: true });
}

function closeProject() {
  projectVideo.pause();
  if (projectDialog.open) projectDialog.close();
}

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => openProject(card.dataset.project, card));
});

dialogClose.addEventListener("click", closeProject);
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) closeProject();
});
projectDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (lastProjectTrigger) lastProjectTrigger.focus({ preventScroll: true });
});
projectPrev.addEventListener("click", () => fillProject(activeProjectIndex - 1));
projectNext.addEventListener("click", () => fillProject(activeProjectIndex + 1));

window.addEventListener("keydown", (event) => {
  if (!projectDialog.open) return;
  if (event.key === "ArrowLeft") fillProject(activeProjectIndex - 1);
  if (event.key === "ArrowRight") fillProject(activeProjectIndex + 1);
});

const loader = document.querySelector("#pageLoader");
const hideLoader = () => loader.classList.add("is-hidden");
Promise.all(
  heroImages.map((image) =>
    image.decode ? image.decode().catch(() => undefined) : Promise.resolve(),
  ),
).finally(() => window.setTimeout(hideLoader, 320));
window.setTimeout(hideLoader, 2400);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    if (targetId === "#home") resetHero();
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const targetTop =
      targetId === "#home"
        ? 0
        : Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 20);
    window.scrollTo({
      top: targetTop,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
});

setHeroStep(0);
