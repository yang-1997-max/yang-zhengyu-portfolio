import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import AnimatedList from "./AnimatedList";
import DriftWall from "./DriftWall";
import type { PhotoGridItem } from "./PhotoGrid";
import SplitText from "./SplitText";
import { usePortfolioMotion } from "./usePortfolioMotion";

const MIST = "#D7E2EA";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

const navItems = [
  { label: "关于", href: "#about" },
  { label: "经历", href: "#experience" },
  { label: "案例", href: "#projects" },
  { label: "联系", href: "#contact" },
];

const marqueeImages = [
  "/assets/work-stills/01.webp",
  "/assets/work-stills/04.webp",
  "/assets/work-stills/07.webp",
  "/assets/work-stills/09.webp",
  "/assets/work-stills/11.webp",
  "/assets/work-stills/12.webp",
  "/assets/work-stills/13.webp",
  "/assets/work-stills/14.webp",
  "/assets/work-stills/15.webp",
  "/assets/work-stills/02.webp",
  "/assets/work-stills/05.webp",
  "/assets/work-stills/08.webp",
  "/assets/work-stills/10.webp",
  "/assets/work-stills/03.webp",
  "/assets/work-stills/06.webp",
];

const experiences = [
  {
    period: "2022.02 — 2026.11",
    company: "上海德健文化创意有限公司",
    role: "影视后期 / 动态视效 / 航拍",
  },
  {
    period: "2019.09 — 2021.12",
    company: "安徽猎眼文化传媒有限公司",
    role: "视频剪辑 / 样片审核 / 客户项目",
  },
];

type Project = {
  number: string;
  name: string;
  category: string;
  images: [string, string, string];
  videos?: {
    name: string;
    duration: string;
    src: string;
    poster: string;
  }[];
};

const studioPhotos: PhotoGridItem[] = [
  {
    id: "studio-01",
    image: "/assets/studio/01.webp",
    title: "复兴之光",
    subtitle: "主题展陈与空间叙事",
    label: "01 / Exhibition",
  },
  {
    id: "studio-11",
    image: "/assets/studio/11.webp",
    title: "主题前厅",
    subtitle: "展陈入口与参观动线",
    label: "02 / Lobby",
  },
  {
    id: "studio-12",
    image: "/assets/studio/12.webp",
    title: "城市会客厅",
    subtitle: "自然采光与会客空间",
    label: "03 / Interior",
  },
  {
    id: "studio-15",
    image: "/assets/studio/15.webp",
    title: "协作空间",
    subtitle: "会议区与团队工作场景",
    label: "04 / Workspace",
  },
  {
    id: "studio-18",
    image: "/assets/studio/18.webp",
    title: "空中花园",
    subtitle: "景观动线与绿植氛围",
    label: "05 / Landscape",
  },
  {
    id: "studio-25",
    image: "/assets/studio/25.webp",
    title: "科技办公",
    subtitle: "信息展示与开放办公",
    label: "06 / Office",
  },
  {
    id: "behind-01",
    image: "/assets/behind-scenes/01.webp",
    title: "城市脉络",
    subtitle: "航拍视角与交通肌理",
    label: "07 / Aerial",
  },
  {
    id: "behind-02",
    image: "/assets/behind-scenes/02.webp",
    title: "都市中轴",
    subtitle: "城市商业与街道观察",
    label: "08 / Cityscape",
  },
  {
    id: "behind-03",
    image: "/assets/behind-scenes/03.webp",
    title: "高处视界",
    subtitle: "建筑群与城市更新",
    label: "09 / Aerial",
  },
  {
    id: "behind-04",
    image: "/assets/behind-scenes/04.webp",
    title: "水杉林",
    subtitle: "生态景观与自然纹理",
    label: "10 / Landscape",
  },
  {
    id: "behind-05",
    image: "/assets/behind-scenes/05.webp",
    title: "林间航线",
    subtitle: "俯瞰田野与水道",
    label: "11 / Aerial",
  },
  {
    id: "behind-06",
    image: "/assets/behind-scenes/06.webp",
    title: "户外展陈",
    subtitle: "装置与活动空间",
    label: "12 / Installation",
  },
  {
    id: "behind-07",
    image: "/assets/behind-scenes/07.webp",
    title: "雪林场景",
    subtitle: "冬日环境与人物装置",
    label: "13 / Outdoor",
  },
];

const driftItems = studioPhotos.map((photo) => ({
  image: photo.image,
  title: photo.title,
}));

const projects: Project[] = [
  {
    number: "01",
    name: "从客户项目到城市展厅，从文旅影像到航拍协作，我更在意信息、节奏与情绪最后能不能落在同一支片子里。",
    category: "Showreel / Selected Clips",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
    videos: [
      {
        name: "航拍截选",
        duration: "00:06",
        src: "/assets/showreel/aerial-selection-v2.mp4",
        poster: "/assets/showreel/aerial-selection-v2-poster.webp",
      },
      {
        name: "昌都",
        duration: "00:12",
        src: "/assets/showreel/01.mp4",
        poster: "/assets/showreel/01-poster.webp",
      },
      {
        name: "飞跃张江",
        duration: "00:14",
        src: "/assets/showreel/02.mp4",
        poster: "/assets/showreel/02-poster.webp",
      },
      {
        name: "鹤壁",
        duration: "00:12",
        src: "/assets/showreel/03.mp4",
        poster: "/assets/showreel/03-poster.webp",
      },
      {
        name: "城垣变迁",
        duration: "00:15",
        src: "/assets/showreel/04.mp4",
        poster: "/assets/showreel/04-poster.webp",
      },
      {
        name: "凯成",
        duration: "00:22",
        src: "/assets/showreel/05.mp4",
        poster: "/assets/showreel/05-poster.webp",
      },
      {
        name: "沁阳",
        duration: "00:16",
        src: "/assets/showreel/07.mp4",
        poster: "/assets/showreel/07-poster.webp",
      },
      {
        name: "万安",
        duration: "00:33",
        src: "/assets/showreel/08.mp4",
        poster: "/assets/showreel/08-poster.webp",
      },
      {
        name: "总规",
        duration: "00:14",
        src: "/assets/showreel/09.mp4",
        poster: "/assets/showreel/09-poster.webp",
      },
      {
        name: "AI 人物",
        duration: "00:07",
        src: "/assets/showreel/10.mp4",
        poster: "/assets/showreel/10-poster.webp",
      },
      {
        name: "回收宝 · 群星",
        duration: "00:23",
        src: "/assets/showreel/11.mp4",
        poster: "/assets/showreel/11-poster.webp",
      },
    ],
  },
];

type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  style?: CSSProperties;
};

function FadeIn({
  children,
  as = "div",
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  style,
}: FadeInProps) {
  const Element = as;

  return (
    <Element
      className={className}
      style={style}
      data-reveal=""
      data-reveal-delay={delay}
      data-reveal-duration={duration}
      data-reveal-x={x}
      data-reveal-y={y}
    >
      {children}
    </Element>
  );
}

type MagnetProps = {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
};

function Magnet({
  children,
  className = "",
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: MagnetProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const area = areaRef.current;
      if (!area) return;

      const bounds = area.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const inside =
        event.clientX > bounds.left - padding &&
        event.clientX < bounds.right + padding &&
        event.clientY > bounds.top - padding &&
        event.clientY < bounds.bottom + padding;

      if (!inside) {
        setActive(false);
        setPosition({ x: 0, y: 0 });
        return;
      }

      setActive(true);
      setPosition({
        x: (event.clientX - centerX) / strength,
        y: (event.clientY - centerY) / strength,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength]);

  return (
    <div ref={areaRef} className={className}>
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: active ? activeTransition : inactiveTransition,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[620px] flex-col overflow-x-clip"
      aria-labelledby="hero-title"
      data-hero-section
    >
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="hero-intro-nav relative z-30 flex w-full items-center justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
      >
        <a href="#about" className="opacity-100 transition-opacity duration-200 hover:opacity-70">
          关于
        </a>
        <a href="#experience" className="opacity-100 transition-opacity duration-200 hover:opacity-70">
          经历
        </a>
        <a href="#projects" className="opacity-100 transition-opacity duration-200 hover:opacity-70">
          案例
        </a>
        <a href="#contact" className="opacity-100 transition-opacity duration-200 hover:opacity-70">
          联系
        </a>
      </FadeIn>

      <FadeIn
        delay={0.15}
        y={40}
        className="hero-intro-title relative z-0 mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5"
      >
        <h1
          id="hero-title"
          aria-label="Hi, I’m Yangzhengyu"
          translate="no"
          className="w-full whitespace-nowrap text-center text-[12vw] font-black uppercase leading-none tracking-tight text-[#BBCCD7] sm:text-[12.7vw] md:text-[13vw] lg:text-[13vw]"
        >
          <span className="block" data-hero-line>
            <span className="hero-name-gradient">Hi, I’m</span>
          </span>
          <span className="block" data-hero-line>
            <span className="hero-name-letter--cyan">Y</span>
            <span className="hero-name-gradient">ANG</span>
            <span className="hero-name-letter--violet">Z</span>
            <span className="hero-name-gradient">HENG</span>
            <span className="hero-name-letter--blue">Y</span>
            <span className="hero-name-gradient">U</span>
          </span>
        </h1>
      </FadeIn>

      <div className="hero-portrait-stage pointer-events-none absolute z-10">
        <FadeIn
          delay={0.6}
          y={30}
          className="hero-intro-portrait pointer-events-auto w-full"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="pointer-events-auto w-full"
          >
            <img
              src="/assets/hero-yangzy.png"
              alt="Yangzhengyu framing a portrait with his hands"
              className="hero-portrait-image h-auto w-full select-none"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          delay={0.35}
          y={20}
          className="hero-intro-copy max-w-[170px] sm:max-w-[240px] md:mb-[clamp(10rem,24vh,20rem)] md:max-w-[320px] lg:max-w-[360px]"
        >
          <p className="text-[0.58rem] font-light uppercase tracking-[0.14em] text-[#D7E2EA]/70 sm:text-[0.68rem]">
            杨正宇 · 影视后期
          </p>
          <h2
            className="mt-2 font-medium leading-[0.96] tracking-tight text-[#D7E2EA]"
            style={{ fontSize: "clamp(1.45rem, 2.9vw, 3rem)" }}
          >
            <span className="block">七年打磨</span>
            <span className="block">让每一帧都有</span>
            <span className="block text-cyan-200">情绪</span>
          </h2>
          <p
            className="mt-3 font-light leading-relaxed text-[#D7E2EA]/90"
            style={{ fontSize: "clamp(0.72rem, 1.05vw, 1.15rem)" }}
          >
            从文案分镜到剪辑、调色、动效与声音，我习惯把复杂信息整理成清楚、有张力的视觉叙事。也参与前期拍摄与无人机航拍，让后期判断更贴近现场。
          </p>
        </FadeIn>

      </div>
    </section>
  );
}

function FloatingNavigation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateNavigation = () => {
      setVisible(window.scrollY > window.innerHeight * 0.92);
    };

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    window.addEventListener("resize", updateNavigation);
    return () => {
      window.removeEventListener("scroll", updateNavigation);
      window.removeEventListener("resize", updateNavigation);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.header
          initial={{ opacity: 0, y: -36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        >
          <nav
            aria-label="悬浮导航"
            className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0C0C0C]/65 px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:px-6 sm:py-3.5 sm:text-sm md:px-8"
          >
            <a
              href="#home"
              className="shrink-0 font-black tracking-[0.08em] transition-opacity duration-200 hover:opacity-70"
            >
              Yangzhengyu
            </a>
            <div className="flex items-center gap-4 sm:gap-7 md:gap-10">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition-opacity duration-200 hover:opacity-70"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </motion.header>
      ) : null}
    </AnimatePresence>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    if (isMobile) return;

    const updateOffset = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.offsetTop;
      setScrollOffset(
        (window.scrollY - sectionTop + window.innerHeight) * 0.3,
      );
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);
    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, [isMobile]);

  const firstRow = marqueeImages.slice(0, 11);
  const secondRow = marqueeImages.slice(11);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
      aria-label="Motion design previews"
      data-marquee-section
    >
      {isMobile ? (
        <div className="space-y-3">
          <p className="px-5 text-[0.72rem] font-medium tracking-[0.16em] text-[#D7E2EA]/65">
            左右滑动浏览作品画面
          </p>
          <MobileMarqueeRow images={firstRow} />
          <MobileMarqueeRow images={secondRow} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <MarqueeRow images={firstRow} translation={scrollOffset - 200} />
          <MarqueeRow images={secondRow} translation={-(scrollOffset - 200)} />
        </div>
      )}
    </section>
  );
}

function MobileMarqueeRow({ images }: { images: string[] }) {
  return (
    <div
      className="marquee-mobile-row"
      role="region"
      aria-label="作品画面，可左右滑动浏览"
      tabIndex={0}
    >
      {images.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="marquee-mobile-card"
        />
      ))}
    </div>
  );
}

function MarqueeRow({
  images,
  translation,
}: {
  images: string[];
  translation: number;
}) {
  const tripledImages = [...images, ...images, ...images];

  return (
    <div
      className="flex w-max gap-3"
      style={{
        transform: `translateX(${translation}px)`,
        willChange: "transform",
      }}
    >
      {tripledImages.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          loading="lazy"
          className="h-[230px] w-[360px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

type AnimatedCharProps = {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function AnimatedChar({ char, index, total, progress }: AnimatedCharProps) {
  const start = (index / Math.max(total - 1, 1)) * 0.85;
  const end = Math.min(start + 0.15, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

function AnimatedText({ text }: { text: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const characters = Array.from(text.replace(/\s/g, "\u00A0"));
  const tokens = text.match(/[A-Za-z0-9'’_-]+|\s+|./gu) ?? [];
  let characterIndex = 0;

  return (
    <p
      ref={textRef}
      aria-label={text}
      className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
      style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      <span aria-hidden="true" className="flex flex-wrap justify-center gap-y-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.92)]">
        {tokens.map((token, tokenIndex) => {
          const letters = Array.from(
            /^\s+$/.test(token) ? "\u00A0".repeat(Array.from(token).length) : token,
          );
          return (
            <span key={`${token}-${tokenIndex}`} className="inline-block whitespace-nowrap">
              {letters.map((char) => {
                const index = characterIndex;
                characterIndex += 1;
                return (
                  <AnimatedChar
                    key={`${char}-${index}`}
                    char={char}
                    index={index}
                    total={characters.length}
                    progress={scrollYProgress}
                  />
                );
              })}
            </span>
          );
        })}
      </span>
    </p>
  );
}

function DecorativeImage({
  src,
  className,
  delay,
  x,
}: {
  src: string;
  className: string;
  delay: number;
  x: number;
}) {
  return (
    <FadeIn
      delay={delay}
      x={x}
      y={0}
      duration={0.9}
      className={`pointer-events-none absolute z-0 ${className}`}
    >
      <img
        src={src}
        alt=""
        className="h-auto w-full select-none"
        loading="lazy"
        data-parallax="0.12"
      />
    </FadeIn>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden px-5 py-20 sm:px-8 md:px-10"
      data-section
    >
      <div
        className="section-ghost left-[3%] top-[6%]"
        aria-hidden="true"
      >
        PROFILE
      </div>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src="/assets/about-yangzy-cutout.webp"
          alt=""
          className="absolute left-1/2 top-1/2 w-[115vw] max-w-none -translate-x-1/2 -translate-y-[47%] opacity-[0.62] md:left-auto md:right-[-4%] md:w-[54vw] md:max-w-[780px] md:translate-x-0"
          style={{
            filter:
              "saturate(1.06) contrast(1.06) brightness(1.27) drop-shadow(0 0 84px rgba(64, 161, 255, 0.3))",
            maskImage:
              "radial-gradient(ellipse 56% 72% at 50% 48%, #000 34%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 56% 72% at 50% 48%, #000 34%, transparent 78%)",
          }}
        />
        <img
          src="/assets/about-yangzy-cutout.webp"
          alt=""
          className="absolute left-1/2 top-1/2 w-[115vw] max-w-none -translate-x-1/2 -translate-y-[47%] opacity-[0.52] md:left-auto md:right-[-4%] md:w-[54vw] md:max-w-[780px] md:translate-x-0"
          style={{
            filter:
              "saturate(1.38) contrast(1.12) brightness(1.5) drop-shadow(0 0 18px rgba(90, 220, 255, 0.2))",
            mixBlendMode: "screen",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 24%, transparent 36%)",
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 24%, transparent 36%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(12,12,12,0.02)_0%,#0C0C0C_74%)]" />
        <div className="absolute right-[4%] top-1/2 h-[48vw] w-[48vw] -translate-y-1/2 rounded-full bg-cyan-400/[0.045] blur-[110px]" />
      </div>
      <DecorativeImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        delay={0.1}
        x={-80}
        className="left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]"
      />
      <DecorativeImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
        delay={0.25}
        x={-80}
        className="bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]"
      />
      <DecorativeImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
        delay={0.15}
        x={80}
        className="right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]"
      />
      <DecorativeImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
        delay={0.3}
        x={80}
        className="bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]"
      />

      <FadeIn
        delay={0.15}
        y={0}
        className="section-kicker absolute right-5 top-28 z-10 text-[0.58rem] font-medium uppercase tracking-[0.34em] text-[#D7E2EA]/55 sm:right-8 md:right-[22%] md:top-[7.5rem] md:text-[0.68rem]"
      >
        PROFILE / 03
      </FadeIn>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <FadeIn delay={0} y={40} className="heading-reveal">
          <h2
            className="hero-heading text-center font-black leading-[1.03] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 7.2vw, 108px)" }}
          >
            <span className="block">懂剪辑</span>
            <span className="block">也懂镜头</span>
            <span className="block">是怎样发生的</span>
          </h2>
        </FadeIn>

        <div className="mt-10 flex flex-col items-center gap-16 sm:mt-14 sm:gap-20 md:mt-16 md:gap-24">
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            <AnimatedText text="2019 年入行，长期参与城市展厅、文旅宣传片、品牌影像与航拍项目。能够独立完成视频剪辑、调色、字幕、配音、音效、AE 动态效果、片头片尾和特效包装，也能在项目前期完成拍摄与无人机飞手工作。" />
            <AnimatedText text="我相信后期不是把素材拼起来，而是找出画面与信息之间最准确的节奏。" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-10 rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      data-section
    >
      <div
        className="section-ghost section-ghost--dark right-[2%] top-[7%]"
        aria-hidden="true"
      >
        EXPERIENCE
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <FadeIn
          y={20}
          className="section-kicker mb-5 text-[0.6rem] font-medium uppercase tracking-[0.34em] text-[#0C0C0C]/45 sm:mb-7 sm:text-[0.7rem]"
        >
          EXPERIENCE / 04
        </FadeIn>
        <FadeIn
          as="h2"
          y={40}
          className="heading-reveal font-black leading-[0.98] tracking-tight"
          style={{ fontSize: "clamp(3rem, 7.2vw, 120px)" }}
        >
          <span className="block">从真实拍摄</span>
          <span className="block">
            走到最终<span className="text-[#159bb8]">成片</span>
          </span>
        </FadeIn>

        <div className="stagger-group mt-14 grid gap-4 sm:mt-16 md:grid-cols-2 md:gap-5 lg:mt-20">
          {experiences.map((experience, index) => (
            <FadeIn
              key={experience.company}
              delay={index * 0.1}
              y={32}
              className="stagger-item flex min-h-[230px] flex-col border border-[rgba(12,12,12,0.16)] bg-black/[0.018] p-6 sm:min-h-[260px] sm:p-8 md:p-10"
            >
              <time className="text-[0.62rem] font-medium tracking-[0.18em] text-[#0C0C0C]/55 sm:text-[0.72rem]">
                {experience.period}
              </time>
              <h3 className="mt-auto text-xl font-semibold leading-tight sm:text-2xl">
                {experience.company}
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-[#0C0C0C]/65 sm:text-base">
                {experience.role}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowreelGallery({
  videos,
}: {
  videos: NonNullable<Project["videos"]>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos[activeIndex];
  const playlistItems = useMemo(
    () =>
      videos.map((video, index) => ({
        id: video.src,
        title: video.name,
        description: video.duration,
        meta: String(index + 1).padStart(2, "0"),
        image: video.poster,
      })),
    [videos],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !audioEnabled;
    const startPlayback = () => {
      video.muted = !audioEnabled;
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
    } else {
      video.addEventListener("loadeddata", startPlayback, { once: true });
      return () => video.removeEventListener("loadeddata", startPlayback);
    }
  }, [activeIndex, audioEnabled]);

  return (
    <div className="stagger-item grid gap-3 sm:gap-4 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
      <AnimatedList
        items={playlistItems}
        selectedIndex={activeIndex}
        onItemSelect={(_item, index) => setActiveIndex(index)}
        animation="pop"
        theme="dark"
        className="order-2 md:order-1 md:max-h-[416px]"
      />

      <div className="order-1 md:order-2" data-media-reveal>
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black sm:rounded-[38px]">
          <video
            key={activeVideo.src}
            ref={videoRef}
            id="showreel-player"
            src={activeVideo.src}
            poster={activeVideo.poster}
            controls
            muted={!audioEnabled}
            autoPlay
            loop
            playsInline
            preload="metadata"
            onVolumeChange={(event) => {
              const enabled = !event.currentTarget.muted;
              setAudioEnabled((current) =>
                current === enabled ? current : enabled,
              );
            }}
            aria-label={`${activeVideo.name}成片节选`}
            className="aspect-video h-full w-full bg-black object-contain"
          />
        </div>
        <p className="mt-2 text-center text-[0.68rem] font-light tracking-[0.08em] text-[#D7E2EA]/55 sm:text-[0.74rem]">
          滑动选择作品，点击即可播放
        </p>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  totalCards,
}: {
  project: Project;
  index: number;
  totalCards: number;
}) {
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const { scrollYProgress } = useScroll({
    target: cardWrapRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardWrapRef}
      className="pb-10 md:h-[85vh] md:pb-0"
    >
      <motion.article
        className="stagger-group relative rounded-[30px] border border-[#D7E2EA]/45 bg-[#0C0C0C] p-3 sm:rounded-[50px] sm:border-2 sm:border-[#D7E2EA] sm:p-6 md:sticky md:rounded-[60px] md:p-8"
        style={{
          scale: isMobile ? 1 : scale,
          top: `calc(clamp(6rem, 8vw, 8rem) + ${index * 28}px)`,
          transformOrigin: "top center",
          zIndex: index + 1,
        }}
      >
        <div className="stagger-item mb-8 flex flex-wrap items-center justify-between gap-5 md:mb-11">
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50 sm:text-sm">
                {project.category}
              </p>
              <h3 className="mt-4 min-h-[5.8em] max-w-[820px] text-base font-medium normal-case leading-[1.45] text-[#D7E2EA] sm:min-h-[4.35em] sm:text-lg md:min-h-[2.9em] md:text-2xl">
                <SplitText
                  text={project.name}
                  className="block w-full font-extrabold leading-[1.35] tracking-tight"
                  effect="rise"
                  splitType="chars"
                  delay={50}
                  duration={1.25}
                  staggerFrom="start"
                  trigger="view"
                  hoverEffect="lift"
                  loop={false}
                  loopDelay={1.5}
                  mask={false}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  onLetterAnimationComplete={() => undefined}
                />
              </h3>
            </div>
          </div>
        </div>

        {project.videos ? (
          <ShowreelGallery videos={project.videos} />
        ) : (
          <div
            className="stagger-item grid grid-cols-[0.4fr_0.6fr] gap-3 sm:gap-4"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <img
                src={project.images[0]}
                alt={`${project.name} detail`}
                loading="lazy"
                className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(130px, 16vw, 230px)" }}
              />
              <img
                src={project.images[1]}
                alt={`${project.name} process`}
                loading="lazy"
                className="w-full flex-1 rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
                style={{ minHeight: "clamp(160px, 22vw, 340px)" }}
              />
            </div>
            <img
              src={project.images[2]}
              alt={`${project.name} cover`}
              loading="lazy"
              className="h-full min-h-[290px] w-full rounded-[40px] object-cover sm:min-h-[420px] sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
        )}
      </motion.article>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
      data-section
    >
      <div
        className="section-ghost left-[3%] top-[5%]"
        aria-hidden="true"
      >
        SELECTED WORK
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
        aria-hidden="true"
      >
        <DriftWall
          items={driftItems}
          columns={5}
          tileWidth={220}
          tileHeight={132}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.32}
          dim={0.32}
          overlayColor="#060010"
        />
      </div>
      <FadeIn
        y={20}
        className="section-kicker relative z-10 text-center text-[0.62rem] font-medium uppercase tracking-[0.34em] text-[#D7E2EA]/50 sm:text-[0.72rem]"
      >
        SELECTED WORK / 03
      </FadeIn>
      <FadeIn
        as="h2"
        y={40}
        className="heading-reveal hero-heading relative z-10 mb-12 mt-5 text-center font-black uppercase leading-none tracking-tight sm:mb-16 md:mb-20"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        项目案例
      </FadeIn>

      <div className="relative z-10 mx-auto max-w-7xl">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={projects.length}
          />
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0C0C0C] px-5 py-24 text-[#D7E2EA] sm:px-8 sm:py-28 md:px-10 md:py-32"
      data-section
    >
      <div
        className="section-ghost bottom-[8%] left-[3%]"
        aria-hidden="true"
      >
        CONTACT
      </div>
      <div
        className="pointer-events-none absolute left-[8%] top-1/2 h-[50vw] max-h-[720px] w-[50vw] max-w-[720px] -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-24%] right-[-8%] h-[42vw] max-h-[580px] w-[42vw] max-w-[580px] rounded-full bg-cyan-400/[0.055] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <FadeIn
          delay={0}
          y={24}
          className="section-kicker text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/55 sm:text-[0.68rem]"
        >
          Let&apos;s make something move
        </FadeIn>

        <FadeIn delay={0.1} y={40} className="heading-reveal">
          <h2
            className="hero-heading mt-5 max-w-[1300px] font-black leading-[0.98] tracking-tight sm:mt-7"
            style={{ fontSize: "clamp(3rem, 5.8vw, 112px)" }}
          >
            <span className="block sm:inline-block">有下一段故事</span>
            <span className="mt-2 block sm:ml-[0.35em] sm:mt-0 sm:inline-block">
              一起把它剪出来
            </span>
          </h2>
        </FadeIn>

        <FadeIn
          delay={0.25}
          y={24}
          className="mt-14 border-t border-white/15 pt-7 sm:mt-20 sm:pt-8 md:mt-24 md:pt-10"
        >
          <div className="contact-method-grid stagger-group">
            <a
              href="https://v.douyin.com/28vu4p9uzNY/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card--link stagger-item"
              aria-label="打开我的抖音个人主页"
            >
              <span className="contact-card__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V6l9-2v12" />
                  <ellipse cx="6.5" cy="18.5" rx="2.5" ry="2" />
                  <ellipse cx="15.5" cy="16.5" rx="2.5" ry="2" />
                </svg>
              </span>
              <span className="contact-card__body">
                <span className="contact-card__title">抖音个人主页</span>
                <span className="contact-card__subtitle">
                  查看我的短视频与创意作品
                </span>
              </span>
              <span className="contact-card__arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <div className="contact-card stagger-item">
              <span className="contact-card__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <div className="contact-card__body">
                <h3 className="contact-card__title">商务合作</h3>
                <div className="contact-card__details">
                  <a href="mailto:609744197@qq.com">609744197@qq.com</a>
                  <a href="tel:+8615555374268">15555374268</a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <footer className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-5 text-[0.6rem] font-light uppercase tracking-[0.16em] text-[#D7E2EA]/55 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:text-[0.68rem]">
          <span>杨正宇 · 影视后期 / 动态视觉</span>
          <a
            href="#home"
            className="w-fit transition-opacity duration-200 hover:opacity-70"
          >
            回到顶部 ↑
          </a>
          <span>© 2026</span>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  const appRef = useRef<HTMLElement>(null);
  usePortfolioMotion({ rootRef: appRef });

  return (
    <main
      ref={appRef}
      className="min-h-screen bg-[#0C0C0C] font-sans text-[#D7E2EA]"
      style={{ overflowX: "clip" }}
    >
      <div className="opening-screen" aria-hidden="true">
        <div className="opening-screen__meta" data-opening-meta>
          Yangzhengyu / Portfolio
        </div>
        <div className="opening-screen__mark" data-opening-mark>
          YZY
        </div>
        <div className="opening-screen__footer">
          <span>Film · Motion · Story</span>
          <span>2026</span>
        </div>
        <div className="opening-screen__progress-track">
          <span
            className="opening-screen__progress"
            data-opening-progress
          />
        </div>
      </div>
      <FloatingNavigation />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
