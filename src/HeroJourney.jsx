import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroJourney.css";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    number: "01",
    label: "OPENING",
    image: "/assets/journey/pose-01.webp",
    alt: "杨正宇与玻璃质感英文姓名背景的封面画面",
  },
  {
    number: "02",
    label: "PROFILE",
    image: "/assets/journey/pose-02.webp",
    alt: "杨正宇向前伸手的人物画面",
  },
  {
    number: "03",
    label: "EXPERIENCE",
    image: "/assets/journey/pose-03.webp",
    alt: "杨正宇倚靠在剪辑软件方块旁的人物画面",
  },
];

const projectHighlights = [
  ["黄海森林", "航拍 · 剪辑 · 调色"],
  ["鹤壁城市展厅", "展陈总归影片"],
  ["张江科学之门", "城市形象影像"],
  ["昌都 / 芒康", "地域影像与城市叙事"],
  ["中国商飞", "企业展陈影像"],
  ["中环龙东大道立交", "航拍与节奏剪辑"],
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

function LongArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 84 12" width="84" height="12" fill="none">
      <path d="M0 6h82M77 1l5 5-5 5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function HeroJourney() {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const panelRefs = useRef([]);
  const flareRef = useRef(null);
  const scanRef = useRef(null);
  const hasMountedRef = useRef(false);
  const activeStageRef = useRef(0);
  const previousStageRef = useRef(null);
  const wheelLockRef = useRef(0);
  const interactionReadyAtRef = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : performance.now() + 3300,
  );
  const programmaticScrollUntilRef = useRef(0);

  const [activeStage, setActiveStage] = useState(0);
  const [previousStage, setPreviousStage] = useState(null);
  const [direction, setDirection] = useState(1);

  const commitStage = useCallback((nextStage) => {
    const clampedStage = Math.max(0, Math.min(stages.length - 1, nextStage));
    const previous = activeStageRef.current;

    if (clampedStage === previous) return;

    previousStageRef.current = previous;
    activeStageRef.current = clampedStage;
    setDirection(clampedStage > previous ? 1 : -1);
    setPreviousStage(previous);
    setActiveStage(clampedStage);
  }, []);

  const goToStage = useCallback(
    (nextStage) => {
      const clampedStage = Math.max(0, Math.min(stages.length - 1, nextStage));
      const section = sectionRef.current;

      commitStage(clampedStage);

      if (!section) return;

      const scrollableDistance = Math.max(
        1,
        section.offsetHeight - window.innerHeight,
      );
      const targets = [0.02, 0.48, 0.84];
      programmaticScrollUntilRef.current = Date.now() + 1650;

      window.scrollTo({
        top: section.offsetTop + scrollableDistance * targets[clampedStage],
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    },
    [commitStage],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (Date.now() < programmaticScrollUntilRef.current) return;

        const nextStage =
          self.progress < 0.3 ? 0 : self.progress < 0.68 ? 1 : 2;
        commitStage(nextStage);
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      trigger.kill();
      window.removeEventListener("load", refresh);
    };
  }, [commitStage]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const handleWheel = (event) => {
      const movingDown = event.deltaY > 14;
      const mostlyVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);

      if (performance.now() < interactionReadyAtRef.current) {
        event.preventDefault();
        return;
      }

      if (!movingDown || !mostlyVertical || activeStageRef.current >= 2) {
        return;
      }

      event.preventDefault();

      if (Date.now() < wheelLockRef.current) return;

      wheelLockRef.current = Date.now() + 980;
      goToStage(activeStageRef.current + 1);
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleWheel);
  }, [goToStage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable)
      ) {
        return;
      }

      if (performance.now() < interactionReadyAtRef.current) return;

      if (
        ["ArrowRight", "ArrowDown", "PageDown"].includes(event.key) &&
        activeStageRef.current < 2
      ) {
        event.preventDefault();
        goToStage(activeStageRef.current + 1);
      }

      if (
        ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key) &&
        activeStageRef.current > 0
      ) {
        event.preventDefault();
        goToStage(activeStageRef.current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToStage]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const handlePointerMove = (event) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      section.style.setProperty("--journey-pointer-x", `${x * 22}px`);
      section.style.setProperty("--journey-pointer-y", `${y * 14}px`);
      section.style.setProperty("--journey-glow-x", `${(x + 0.5) * 100}%`);
      section.style.setProperty("--journey-glow-y", `${(y + 0.5) * 100}%`);
    };

    const handlePointerLeave = () => {
      section.style.setProperty("--journey-pointer-x", "0px");
      section.style.setProperty("--journey-pointer-y", "0px");
    };

    section.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    const previous = previousStageRef.current;
    const outgoingImage = imageRefs.current[previous];
    const incomingImage = imageRefs.current[activeStage];
    const incomingPanel = panelRefs.current[activeStage];
    const outgoingPanel = panelRefs.current[previous];

    if (!incomingImage) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(imageRefs.current, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(incomingImage, { autoAlpha: 1, visibility: "visible" });
      gsap.set(panelRefs.current, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(incomingPanel, { autoAlpha: 1, visibility: "visible" });
      setPreviousStage(null);
      return undefined;
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        if (outgoingImage) {
          gsap.set(outgoingImage, {
            autoAlpha: 0,
            visibility: "hidden",
            clipPath: "inset(0 0 0 0)",
            filter: "none",
            scale: 1,
            xPercent: 0,
          });
        }
        setPreviousStage(null);
      },
    });

    const incomingClip =
      direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

    gsap.set(incomingImage, {
      autoAlpha: 1,
      visibility: "visible",
      zIndex: 30 + activeStage,
      scale: 1.065,
      xPercent: direction > 0 ? 1.2 : -1.2,
      filter: "blur(10px) saturate(0.9)",
      clipPath: incomingClip,
    });

    if (outgoingImage) {
      timeline.to(
        outgoingImage,
        {
          autoAlpha: 0,
          scale: 1.045,
          xPercent: direction > 0 ? -1.5 : 1.5,
          filter: "blur(8px) saturate(0.82)",
          duration: 1.28,
          ease: "power2.inOut",
        },
        0,
      );
    }

    timeline
      .to(
        incomingImage,
        {
          autoAlpha: 1,
          scale: 1,
          xPercent: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px) saturate(1)",
          duration: 1.6,
          ease: "expo.out",
        },
        0.04,
      )
      .fromTo(
        flareRef.current,
        {
          autoAlpha: 0,
          xPercent: direction > 0 ? -180 : 180,
          skewX: direction > 0 ? -13 : 13,
        },
        {
          autoAlpha: 0.82,
          xPercent: direction > 0 ? 90 : -90,
          duration: 1.05,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        0.12,
      )
      .fromTo(
        scanRef.current,
        { scaleY: 0, transformOrigin: direction > 0 ? "top" : "bottom" },
        {
          scaleY: 1,
          duration: 1.1,
          ease: "expo.inOut",
          yoyo: true,
          repeat: 1,
        },
        0.12,
      );

    if (outgoingPanel && outgoingPanel !== incomingPanel) {
      timeline.to(
        outgoingPanel,
        {
          autoAlpha: 0,
          y: direction > 0 ? -24 : 24,
          duration: 0.48,
          ease: "power2.in",
        },
        0,
      );
    }

    if (incomingPanel) {
      const staggerItems = incomingPanel.querySelectorAll("[data-stagger]");
      gsap.set(incomingPanel, { visibility: "visible" });

      timeline
        .fromTo(
          incomingPanel,
          {
            autoAlpha: 0,
            y: 38,
            clipPath:
              activeStage === 1
                ? "inset(0 0 0 100%)"
                : "inset(0 100% 0 0)",
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.05,
            ease: "expo.out",
          },
          0.58,
        )
        .fromTo(
          staggerItems,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.075,
            ease: "power3.out",
          },
          0.82,
        );
    }

    return () => timeline.kill();
  }, [activeStage, direction]);

  const handleSurfaceClick = (event) => {
    if (event.target.closest("a, button")) return;
    if (performance.now() < interactionReadyAtRef.current) return;
    if (activeStageRef.current >= stages.length - 1) return;
    goToStage(activeStageRef.current + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="hero-journey"
      id="home"
      data-stage={activeStage + 1}
      aria-label="杨正宇影视后期个人作品集开场"
      onClick={handleSurfaceClick}
    >
      <div className="hero-journey__sticky">
        <div className="journey-atmosphere" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="journey-visuals" aria-live="polite">
          {stages.map((stage, index) => {
            const classNames = [
              "journey-visual",
              `journey-visual--${index + 1}`,
              index === activeStage ? "is-current" : "",
              index === previousStage ? "is-previous" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <figure
                className={classNames}
                key={stage.number}
                ref={(node) => {
                  imageRefs.current[index] = node;
                }}
                aria-hidden={index !== activeStage}
              >
                <div className="journey-visual__media">
                  <img
                    src={stage.image}
                    alt={index === activeStage ? stage.alt : ""}
                    loading="eager"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    draggable="false"
                  />
                </div>
              </figure>
            );
          })}
        </div>

        <div className="journey-readability" aria-hidden="true" />
        <div
          className="journey-transition-flare"
          ref={flareRef}
          aria-hidden="true"
        />
        <div className="journey-scan-line" ref={scanRef} aria-hidden="true" />
        <div className="journey-particle-field" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i
              key={index}
              style={{
                "--particle": index,
                "--particle-top": `${7 + ((index * 17) % 82)}%`,
                "--particle-left": `${2 + ((index * 29) % 95)}%`,
                "--particle-size": `${1 + (index % 3)}px`,
                "--particle-opacity": 0.18 + (index % 4) * 0.1,
              }}
            />
          ))}
        </div>

        <div className="container hero-journey__frame">
          <div className="journey-hero-meta">
            <p>
              <span className="journey-signal" />
              SHANGHAI · CHINA
            </p>
            <p>FILM EDITOR / COLORIST / MOTION</p>
          </div>

          <div
            className={`journey-panel journey-panel--opening ${
              activeStage === 0 ? "is-current" : ""
            }`}
            ref={(node) => {
              panelRefs.current[0] = node;
            }}
          >
            <span className="journey-panel__index">01 / OPENING</span>
            <div>
              <p data-stagger>YANG ZHENGYU · PORTFOLIO 2019—2026</p>
              <h1 data-stagger>
                杨正宇
                <small>影视后期 / VISUAL POST</small>
              </h1>
            </div>
          </div>

          <aside
            className={`journey-panel journey-panel--profile ${
              activeStage === 1 ? "is-current" : ""
            }`}
            ref={(node) => {
              panelRefs.current[1] = node;
            }}
            aria-hidden={activeStage !== 1}
          >
            <div className="journey-panel__heading">
              <span>02 / PROFILE</span>
              <span>ABOUT ME</span>
            </div>
            <h2 data-stagger>
              YANG
              <br />
              ZHENGYU
            </h2>
            <p className="journey-panel__role" data-stagger>
              影视后期 / 上海
            </p>
            <p className="journey-panel__body" data-stagger>
              7 年影视后期经验，专注品牌、城市与展陈影像。以剪辑建立节奏，以色彩赋予情绪，让每一支影片从技术交付走向完整表达。
            </p>
            <div className="journey-panel__tools" data-stagger>
              <span>PR</span>
              <span>AE</span>
              <span>DAVINCI</span>
              <span>CAPCUT</span>
              <span>PS</span>
              <span>AI</span>
              <span>AU</span>
            </div>
            <div className="journey-panel__contact" data-stagger>
              <a href="mailto:609744197@qq.com">609744197@qq.com</a>
              <a href="tel:15555374268">155 5537 4268</a>
            </div>
          </aside>

          <aside
            className={`journey-panel journey-panel--experience ${
              activeStage === 2 ? "is-current" : ""
            }`}
            ref={(node) => {
              panelRefs.current[2] = node;
            }}
            aria-hidden={activeStage !== 2}
          >
            <div className="journey-panel__heading">
              <span>03 / EXPERIENCE</span>
              <span>SELECTED</span>
            </div>
            <h2 data-stagger>
              把空间与城市
              <br />
              剪辑成记忆。
            </h2>
            <div className="journey-project-list">
              {projectHighlights.map(([title, detail], index) => (
                <div className="journey-project" data-stagger key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </div>
              ))}
            </div>
            <a className="journey-project-link" href="#projects" data-stagger>
              <span>查看完整精选项目</span>
              <ArrowUpRight />
            </a>
          </aside>

          <div className="journey-interface">
            <div className="journey-stage-nav" aria-label="切换首页叙事阶段">
              {stages.map((stage, index) => (
                <button
                  className={index === activeStage ? "is-active" : ""}
                  key={stage.number}
                  type="button"
                  aria-label={`前往第 ${index + 1} 页：${stage.label}`}
                  aria-current={index === activeStage ? "step" : undefined}
                  onClick={() => goToStage(index)}
                >
                  <span>{stage.number}</span>
                  <i />
                  <small>{stage.label}</small>
                </button>
              ))}
            </div>

            <div className="journey-action">
              <span className="journey-action__line" aria-hidden="true">
                <i />
              </span>
              <p>
                {activeStage === 0 && "点击或滑动，开始认识我"}
                {activeStage === 1 && "再次点击或滑动，查看项目经历"}
                {activeStage === 2 && "继续探索下方精选作品"}
              </p>
              {activeStage < 2 ? (
                <button
                  type="button"
                  onClick={() => goToStage(activeStage + 1)}
                  aria-label="进入下一页"
                >
                  <LongArrow />
                </button>
              ) : (
                <a href="#projects" aria-label="前往精选项目">
                  <LongArrow />
                </a>
              )}
            </div>

            <p className="journey-side-note">
              CLICK
              <br />
              OR SCROLL
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
