import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardSpread from "./CardSpread";
import CircleGallery from "./CircleGallery";
import FrameBorder from "./FrameBorder";
import Grainient from "./Grainient";
import HeroJourney from "./HeroJourney";
import RisingInk from "./RisingInk";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "作品", href: "#projects", en: "WORK" },
  { label: "关于", href: "#about", en: "ABOUT" },
  { label: "优势", href: "#capabilities", en: "CRAFT" },
  { label: "联系", href: "#contact", en: "CONTACT" },
];

const projects = [
  {
    number: "01",
    title: "黄海森林",
    image: "/assets/grid/huanghai-1.jpg",
    description:
      "以航拍串联森林、水系与季节变化，保留自然空间安静而开阔的呼吸感。",
  },
  {
    number: "02",
    title: "鹤壁城市展厅",
    image: "/assets/grid/hebi-1.jpg",
    description:
      "结合数字沙盘与城市航拍，梳理空间信息和观看节奏，完成展厅总归影片。",
  },
  {
    number: "03",
    title: "张江科学之门",
    image: "/assets/grid/twin-towers.jpg",
    description:
      "通过延时与鸟瞰视角呈现双子塔和城市脉络，建立清晰的速度感与科技气质。",
  },
  {
    number: "04",
    title: "昌都",
    image: "/assets/grid/changdu-1.jpg",
    description:
      "以高原地貌、城市生长与人文现场构成地域叙事，呈现辽阔而有温度的城市形象。",
  },
  {
    number: "05",
    title: "芒康",
    image: "/assets/grid/mangkang-1.jpg",
    description:
      "围绕山川、道路与城市尺度建立视觉锚点，形成具有电影感的地域文化表达。",
  },
  {
    number: "06",
    title: "中国商飞",
    image: "/assets/grid/comac-1.jpg",
    description:
      "以企业空间与制造现场构成循环影像，兼顾展厅氛围、信息清晰度和持续观看体验。",
  },
  {
    number: "07",
    title: "中环龙东大道立交航拍",
    image: "/assets/grid/elevated-road-2.jpg",
    description:
      "以航拍呈现中环龙东大道立交与城市道路的线条关系，突出城市流动感和空间尺度。",
  },
  {
    number: "08",
    title: "叶县序厅",
    image: "/assets/grid/yexian-3.jpg",
    description:
      "结合地域文化与城市影像，为序厅建立自然、清晰且具有代入感的视觉开篇。",
  },
  {
    number: "09",
    title: "江西万安",
    image: "/assets/grid/wanan.jpg",
    description:
      "通过航拍串联桥梁、水系与城市空间，呈现项目环境与整体建设尺度。",
  },
  {
    number: "10",
    title: "凯成养老院",
    image: "/assets/grid/kaicheng.jpg",
    description:
      "以温和、清晰的镜头语言呈现项目空间，让环境与服务内容更容易被理解。",
  },
];

const capabilities = [
  {
    number: "01",
    en: "STORY & RHYTHM",
    title: "叙事与节奏",
    text: "从分镜与文案出发组织镜头取舍、信息密度和情绪起伏。让内容有速度，也有呼吸。",
    tools: ["PREMIERE PRO", "STORY EDITING"],
  },
  {
    number: "02",
    en: "MOTION & PACKAGING",
    title: "动效与包装",
    text: "完成片头片尾、信息图形、展厅屏幕视觉与版式包装，让画面表达稳定统一并具备辨识度。",
    tools: ["AFTER EFFECTS", "VISUAL SYSTEM"],
  },
  {
    number: "03",
    en: "COLOR & TEXTURE",
    title: "色彩与质感",
    text: "使用达芬奇统一多来源素材的影调与色彩逻辑，雕琢画面的空间感、通透度和电影质感。",
    tools: ["DAVINCI RESOLVE", "COLOR GRADE"],
  },
  {
    number: "04",
    en: "PRODUCTION TO DELIVERY",
    title: "从现场到交付",
    text: "理解前期拍摄与航拍，协同策划、客户和团队推进版本迭代，把控成片质量与交付时效。",
    tools: ["ON-SET", "AERIAL", "DELIVERY"],
  },
];

const experiences = [
  {
    date: "2022.02 — NOW",
    company: "上海德健文化创意有限公司",
    role: "影视后期 / 展陈影像",
    description:
      "独立完成剪辑、调色、字幕、音效与 AE 视觉包装；参与前期拍摄和无人机航拍，负责展陈影片成片质量与交付节奏。",
  },
  {
    date: "2019.09 — 2021.12",
    company: "安徽猫眼文化传媒有限公司",
    role: "视频后期 / 内容制作",
    description:
      "负责短视频、VLOG、电影解说、宣传片与活动影片后期，并参与客户沟通、素材整理、样片审核与拍摄执行。",
  },
  {
    date: "2017.09 — 2019.06",
    company: "安徽电子信息职业技术学院",
    role: "动漫设计与制作",
    description:
      "系统学习动画、影像与视觉设计基础；在校期间担任班长与学生会部长，参与并负责学校大型活动、讲座与影像执行。",
  },
];

const softwareTools = [
  { name: "Premiere Pro", icon: "/assets/software/premiere.svg" },
  { name: "After Effects", icon: "/assets/software/after-effects.svg" },
  { name: "DaVinci Resolve", icon: "/assets/software/davinci-resolve.svg" },
  { name: "CapCut 剪映", icon: "/assets/software/capcut.svg" },
  { name: "Illustrator", icon: "/assets/software/illustrator.svg" },
  { name: "Photoshop", icon: "/assets/software/photoshop.svg" },
  { name: "Audition", icon: "/assets/software/audition.svg" },
];

function ArrowUpRight({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
    >
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="8" y="8" width="11" height="11" stroke="currentColor" />
      <path d="M16 8V5H5v11h3" stroke="currentColor" />
    </svg>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 28);
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerMove = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(".opening-curtain", { display: "none" });
      return undefined;
    }

    const context = gsap.context(() => {
      document.body.style.overflow = "hidden";

      const opening = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          document.body.style.overflow = "";
          gsap.set(".opening-curtain", { display: "none" });
          ScrollTrigger.refresh();
        },
      });

      opening
        .fromTo(
          ".opening-curtain__label",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0.15,
        )
        .to(
          ".opening-curtain__label",
          { autoAlpha: 0, y: -10, duration: 0.45 },
          0.7,
        )
        .to(
          ".opening-curtain__panel",
          {
            scaleY: 0,
            duration: 1.35,
            stagger: 0.08,
            transformOrigin: "top center",
            ease: "expo.inOut",
          },
          0.82,
        )
        .from(
          ".site-header",
          { y: -28, autoAlpha: 0, duration: 1.1 },
          1.05,
        )
        .fromTo(
          ".journey-visual--1",
          {
            autoAlpha: 0,
            scale: 1.12,
            filter: "blur(14px)",
            clipPath: "inset(0 0 100% 0)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            clipPath: "inset(0 0 0% 0)",
            duration: 2.25,
          },
          0.92,
        )
        .from(
          ".journey-hero-meta",
          { autoAlpha: 0, y: -18, duration: 0.95 },
          1.3,
        )
        .from(
          ".journey-panel--opening [data-stagger]",
          {
            autoAlpha: 0,
            y: 46,
            scaleY: 1.12,
            clipPath: "inset(0 0 100% 0)",
            transformOrigin: "left bottom",
            duration: 1.35,
            stagger: 0.12,
          },
          1.45,
        )
        .from(
          ".journey-interface",
          { autoAlpha: 0, y: 24, duration: 1 },
          2.05,
        )
        .set(".journey-visual--1", {
          clearProps:
            "transform,translate,scale,scaleX,scaleY,yPercent,filter,clipPath",
        });

      const animateSection = (selector, setup) => {
        const section = document.querySelector(selector);
        if (!section) return;

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        });

        const word = section.querySelector(".section-word");
        if (word) {
          timeline.fromTo(
            word,
            {
              autoAlpha: 0,
              xPercent: -16,
              yPercent: 42,
              skewX: -8,
              clipPath: "inset(0 100% 0 0)",
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              skewX: 0,
              clipPath: "inset(0 0% 0 0)",
              duration: 1.45,
              ease: "expo.out",
            },
          );
        }

        const heading = section.querySelector(".section-heading");
        if (heading) {
          timeline.from(
            heading,
            {
              autoAlpha: 0,
              y: 76,
              scaleX: 0.9,
              filter: "blur(5px)",
              transformOrigin: "left center",
              duration: 1.25,
            },
            "-=0.82",
          );
        }

        setup(timeline, section);

        const titleTargets = [word, heading].filter(Boolean);
        if (titleTargets.length) {
          timeline.set(
            titleTargets,
            {
              clearProps:
                "transform,translate,scale,scaleX,scaleY,filter,clipPath",
            },
            ">",
          );
        }
      };

      animateSection("#about", (timeline, section) => {
        timeline
          .from(
            section.querySelector(".profile-visual"),
            {
              autoAlpha: 0,
              y: 80,
              clipPath: "inset(12% 10% 12% 10% round 22px)",
              duration: 1.35,
            },
            "-=0.55",
          )
          .from(
            section.querySelector(".about-copy"),
            { autoAlpha: 0, y: 52, duration: 1.15 },
            "-=0.95",
          )
          .from(
            section.querySelectorAll(".experience-row"),
            { autoAlpha: 0, y: 36, duration: 0.9, stagger: 0.16 },
            "-=0.55",
          );
      });

      animateSection("#projects", (timeline, section) => {
        timeline
          .from(
            section.querySelector(".card-spread__stage"),
            {
              clipPath: "inset(22% 0 28% 0 round 24px)",
              duration: 1.4,
            },
            "-=0.48",
          )
          .fromTo(
            section.querySelectorAll(".card-spread__card"),
            { autoAlpha: 0, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 1.05,
              stagger: { each: 0.075, from: "center" },
              clearProps: "opacity,visibility,filter",
            },
            "-=1.1",
          )
          .from(
            section.querySelector(".card-spread__status"),
            { autoAlpha: 0, y: 18, duration: 0.8 },
            "-=0.45",
          );
      });

      animateSection("#capabilities", (timeline, section) => {
        timeline
          .from(
            section.querySelectorAll(".capability-card"),
            { autoAlpha: 0, y: 72, duration: 1.05, stagger: 0.14 },
            "-=0.48",
          )
          .from(
            section.querySelector(".software-strip"),
            { autoAlpha: 0, y: 30, duration: 0.9 },
            "-=0.48",
          );
      });

      animateSection("#contact", (timeline, section) => {
        timeline
          .from(
            section.querySelector(".contact-main h2"),
            {
              autoAlpha: 0,
              yPercent: 55,
              scaleX: 0.86,
              clipPath: "inset(0 0 100% 0)",
              duration: 1.5,
              ease: "expo.out",
            },
            "-=0.55",
          )
          .from(
            section.querySelector(".contact-actions"),
            { autoAlpha: 0, y: 28, duration: 0.9 },
            "-=0.7",
          )
          .from(
            section.querySelector(".footer-meta"),
            { autoAlpha: 0, y: 20, duration: 0.8 },
            "-=0.5",
          );
      });

      gsap.fromTo(
        ".portrait-frame img",
        { yPercent: -4, scale: 1.07 },
        {
          yPercent: 4,
          scale: 1.035,
          ease: "none",
          scrollTrigger: {
            trigger: ".portrait-frame",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.15,
          },
        },
      );

      gsap.fromTo(
        ".card-spread__media img",
        { yPercent: -3, scale: 1.065 },
        {
          yPercent: 3,
          scale: 1.025,
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.25,
          },
        },
      );

      gsap.fromTo(
        ".contact-video",
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        },
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      document.body.style.overflow = "";
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!activeProject) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProject]);

  const copyEmail = async () => {
    const email = "609744197@qq.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="site-shell">
      <div className="opening-curtain" aria-hidden="true">
        <span className="opening-curtain__panel" />
        <span className="opening-curtain__panel" />
        <span className="opening-curtain__panel" />
        <div className="opening-curtain__label">
          <span>YANG ZHENGYU</span>
          <small>FILM / MOTION / STORY</small>
        </div>
      </div>
      <FrameBorder />
      <div className="scroll-progress" style={{ "--progress": `${scrollProgress}%` }} />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="page-grain" aria-hidden="true" />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="返回首页">
            <span className="brand-mark">
              <span />
              <span />
            </span>
            <span className="brand-copy">
              <strong>YANG ZHENGYU</strong>
              <small>VISUAL POST</small>
            </span>
          </a>

          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="主导航">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>{item.label}</span>
                <small>{item.en}</small>
              </a>
            ))}
          </nav>

          <a className="header-contact" href="#contact">
            <span>一起合作</span>
            <ArrowUpRight />
          </a>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "关闭导航" : "打开导航"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <HeroJourney />

        <section className="about section" id="about">
          <Grainient
            colors={["#070707", "#14100c", "#2f1d13", "#9b693a"]}
            angle={55}
            flow={0.8}
            silk={0.35}
            grainAmount={0.08}
            variation={3}
          />
          <span className="section-word section-word--about" aria-hidden="true">
            PROFILE
          </span>
          <div className="container">
            <div className="section-heading section-heading--light" data-reveal>
              <div>
                <p className="eyebrow">PROFILE / 关于我</p>
                <RisingInk as="h2">
                  在时间的缝隙里，
                  <br />
                  寻找画面的<span className="heading-accent">秩序</span>。
                </RisingInk>
              </div>
              <p className="section-heading__note">
                杨正宇，影视后期制作。
                <br />
                居住上海，可接受出差与项目制合作。
              </p>
            </div>

            <div className="about-grid">
              <div className="profile-visual" data-reveal>
                <div className="profile-collage">
                  <div className="portrait-frame frame-border">
                    <img
                      src="/assets/yang-zhengyu.jpg"
                      alt="杨正宇在后期工作室工作"
                    />
                    <div className="portrait-shine" />
                    <span className="portrait-corner portrait-corner--tl" />
                    <span className="portrait-corner portrait-corner--br" />
                    <div className="portrait-label">
                      <span>ON SET / IN STUDIO</span>
                      <strong>YANG ZHENGYU</strong>
                    </div>
                  </div>
                </div>
                <div className="software-gallery">
                  <div className="software-gallery__head">
                    <span>SOFTWARE / 07</span>
                    <small>DRAG TO ROTATE</small>
                  </div>
                  <CircleGallery items={softwareTools} />
                </div>
              </div>

              <div className="about-copy" data-reveal>
                <div className="about-lead">
                  <span className="big-index">07</span>
                  <div>
                    <p className="about-lead__title">YEARS IN MOTION</p>
                    <p>
                      自 2019 年进入影视后期行业，持续在真实项目里打磨从叙事、剪辑、调色到视觉包装的完整能力。
                    </p>
                  </div>
                </div>

                <p className="about-paragraph">
                  我习惯把每一支影片看成一个完整的空间：镜头决定观看方向，节奏控制注意力，色彩赋予情绪，声音让画面真正落地。工作之外，也长期保持健身与运动训练，这让我更重视稳定的节奏、持续的耐力和每次交付的完成度。
                </p>

                <div className="stats-grid">
                  <div className="stat">
                    <strong>07<sup>+</sup></strong>
                    <span>年行业经验</span>
                  </div>
                  <div className="stat">
                    <strong>10<sup>+</sup></strong>
                    <span>展陈与城市影像</span>
                  </div>
                  <div className="stat">
                    <strong>03</strong>
                    <span>城市与地域项目</span>
                  </div>
                </div>

                <div className="contact-strip">
                  <a href="mailto:609744197@qq.com">
                    <small>EMAIL</small>
                    <span>609744197@qq.com</span>
                    <ArrowUpRight size={16} />
                  </a>
                  <a href="tel:15555374268">
                    <small>PHONE</small>
                    <span>155 5537 4268</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="experience-block" data-reveal>
              <div className="experience-title">
                <p className="eyebrow">EXPERIENCE / 工作经历</p>
                <span>2019 — NOW</span>
              </div>
              <div className="experience-list">
                {experiences.map((item) => (
                  <article className="experience-row" key={item.company}>
                    <p className="experience-date">{item.date}</p>
                    <div className="experience-company">
                      <h3>{item.company}</h3>
                      <span>{item.role}</span>
                    </div>
                    <p className="experience-description">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="projects section" id="projects">
          <span className="section-word section-word--work" aria-hidden="true">
            SELECTED WORK
          </span>
          <div className="container">
            <div className="section-heading section-heading--light" data-reveal>
              <div>
                <p className="eyebrow">SELECTED WORK / 精选项目</p>
                <RisingInk as="h2">
                  从一帧开始，
                  <br />
                  让故事自然<span className="heading-accent">发生</span>。
                </RisingInk>
              </div>
              <div className="section-heading__aside">
                <span className="projects-count">10 PROJECTS</span>
              </div>
            </div>

            <CardSpread cards={projects} onSelect={setActiveProject} />
          </div>
        </section>

        <section className="capabilities section" id="capabilities">
          <Grainient
            colors={["#070707", "#14100c", "#2f1d13", "#9b693a"]}
            angle={55}
            flow={0.8}
            silk={0.35}
            grainAmount={0.08}
            variation={7}
          />
          <span className="section-word section-word--craft" aria-hidden="true">
            CAPABILITIES
          </span>
          <div className="container">
            <div className="section-heading section-heading--light" data-reveal>
              <div>
                <p className="eyebrow">CAPABILITIES / 个人优势</p>
                <RisingInk as="h2">
                  不是工具清单，
                  <br />
                  而是把想法变成<span className="heading-accent">成片</span>。
                </RisingInk>
              </div>
              <p className="section-heading__note">
                从理解需求到最终交付，
                <br />
                保持审美判断、执行效率与沟通稳定性。
              </p>
            </div>

            <div className="capabilities-grid" data-reveal>
              {capabilities.map((capability) => (
                <article
                  className="capability-card frame-border"
                  key={capability.number}
                >
                  <div className="capability-card__head">
                    <span>{capability.number}</span>
                    <ArrowUpRight size={20} />
                  </div>
                  <div className="capability-card__body">
                    <p>{capability.en}</p>
                    <h3>{capability.title}</h3>
                    <span>{capability.text}</span>
                  </div>
                  <div className="capability-tools">
                    {capability.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="software-strip" data-reveal>
              <p>
                <span>TOOLS</span>
                日常创作工具
              </p>
              <div>
                {["PR", "AE", "DAVINCI", "CAPCUT", "PS", "AI", "AU"].map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="contact section" id="contact">
          <video
            className="contact-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/forest-autumn-poster.jpg"
            aria-hidden="true"
          >
            <source src="/assets/forest-autumn-loop.mp4" type="video/mp4" />
          </video>
          <div className="contact-wash" aria-hidden="true" />
          <span className="section-word section-word--contact" aria-hidden="true">
            CONTACT
          </span>
          <div className="container contact-inner">
            <div className="contact-topline">
              <p className="eyebrow">CONTACT / 联系</p>
              <p>AVAILABLE FOR SELECTED PROJECTS · 2026</p>
            </div>

            <div className="contact-main" data-reveal>
              <p className="contact-kicker">有一个故事，正在等待被讲述？</p>
              <RisingInk as="h2">
                一起做点
                <br />
                会被记住的<span className="heading-accent">影像</span>。
              </RisingInk>
              <div className="contact-actions">
                <a className="button button--light button--large" href="mailto:609744197@qq.com">
                  <span>发邮件聊一聊</span>
                  <ArrowUpRight size={20} />
                </a>
                <button className="copy-button" type="button" onClick={copyEmail}>
                  <CopyIcon />
                  <span>{copied ? "邮箱已复制" : "复制邮箱地址"}</span>
                </button>
              </div>
            </div>

            <div className="footer-meta">
              <div className="footer-contact-list">
                <div>
                  <small>EMAIL</small>
                  <a href="mailto:609744197@qq.com">609744197@qq.com</a>
                </div>
                <div>
                  <small>PHONE</small>
                  <a href="tel:15555374268">155 5537 4268</a>
                </div>
                <div>
                  <small>LOCATION</small>
                  <span>Shanghai · China</span>
                </div>
              </div>

              <div className="footer-bottom">
                <p>© 2026 YANG ZHENGYU. ALL RIGHTS RESERVED.</p>
                <div>
                  <a
                    href="/assets/杨正宇-个人简历.docx"
                    download="杨正宇-个人简历.docx"
                  >
                    下载简历
                  </a>
                  <a href="#home">BACK TO TOP ↑</a>
                </div>
              </div>
            </div>
          </div>
          <span className="footer-watermark" aria-hidden="true">
            杨正宇
          </span>
        </footer>
      </main>

      {activeProject && (
        <div
          className="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveProject(null);
          }}
        >
          <div className="project-modal__panel">
            <button
              className="project-modal__close"
              type="button"
              aria-label="关闭项目详情"
              onClick={() => setActiveProject(null)}
            >
              <span />
              <span />
            </button>
            <div className="project-modal__image">
              <img src={activeProject.image} alt={`${activeProject.title}项目大图`} />
              <span>
                {activeProject.number} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="project-modal__content">
              <RisingInk
                as="h2"
                id="project-modal-title"
                className={
                  activeProject.title.length > 8
                    ? "project-modal__title--long"
                    : ""
                }
              >
                {activeProject.title}
              </RisingInk>
              <p>{activeProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
