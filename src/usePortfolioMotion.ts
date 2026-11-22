import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type PortfolioMotionOptions = {
  rootRef: RefObject<HTMLElement>;
};

const hiddenClip = "inset(0% 0% 100% 0%)";
const visibleClip = "inset(0% 0% 0% 0%)";

function readNumber(element: HTMLElement, name: string, fallback: number) {
  const value = Number.parseFloat(element.dataset[name] ?? "");
  return Number.isFinite(value) ? value : fallback;
}

export function usePortfolioMotion({ rootRef }: PortfolioMotionOptions) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const previousOverflow = document.body.style.overflow;
    let refreshFrame = 0;
    let disposed = false;

    const context = gsap.context(() => {
      const opening = root.querySelector<HTMLElement>(".opening-screen");
      const hero = root.querySelector<HTMLElement>("[data-hero-section]");
      const heroNav = hero?.querySelector<HTMLElement>(".hero-intro-nav");
      const heroTitle = hero?.querySelector<HTMLElement>(".hero-intro-title");
      const heroLines = hero
        ? gsap.utils.toArray<HTMLElement>("[data-hero-line]", hero)
        : [];
      const heroPortrait = hero?.querySelector<HTMLElement>(
        ".hero-intro-portrait",
      );
      const heroCopy = hero?.querySelector<HTMLElement>(".hero-intro-copy");

      if (reducedMotion) {
        gsap.set(opening, { display: "none" });
        gsap.set(
          [
            heroNav,
            heroTitle,
            ...heroLines,
            heroPortrait,
            heroCopy,
            ...gsap.utils.toArray<HTMLElement>(
              "[data-reveal], .heading-reveal, .stagger-item, .section-kicker, .section-ghost",
              root,
            ),
          ].filter(Boolean),
          { clearProps: "all" },
        );
        return;
      }

      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      });

      const deepLink =
        Boolean(window.location.hash) && window.location.hash !== "#home";

      gsap.set(
        [
          heroNav,
          heroTitle,
          ...heroLines,
          heroPortrait,
          heroCopy,
        ].filter(Boolean),
        { visibility: "visible" },
      );

      if (
        opening &&
        hero &&
        heroNav &&
        heroTitle &&
        heroPortrait &&
        heroCopy &&
        heroLines.length > 0 &&
        !deepLink
      ) {
        document.body.style.overflow = "hidden";
        gsap.set(opening, { display: "flex" });
        gsap.set("[data-opening-meta]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-opening-mark]", {
          autoAlpha: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          scaleY: 1.18,
          transformOrigin: "50% 100%",
        });
        gsap.set("[data-opening-progress]", {
          scaleX: 0,
          transformOrigin: "0% 50%",
        });
        gsap.set(heroNav, { autoAlpha: 0, y: 26 });
        gsap.set(heroTitle, {
          clipPath: hiddenClip,
          y: 72,
          scaleY: 1.12,
          transformOrigin: "50% 100%",
        });
        gsap.set(heroLines, {
          yPercent: 118,
          rotate: 0.8,
          scaleY: 1.24,
          transformOrigin: "50% 100%",
        });
        gsap.set(heroPortrait, {
          autoAlpha: 0,
          clipPath: hiddenClip,
          y: 72,
          scale: 0.94,
        });
        gsap.set(heroCopy, {
          autoAlpha: 0,
          y: 30,
          clipPath: hiddenClip,
        });

        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            gsap.set(
              [heroTitle, heroPortrait, heroCopy].filter(Boolean),
              {
                clearProps: "transform,clipPath,visibility,opacity",
              },
            );
            document.body.style.overflow = previousOverflow;
            ScrollTrigger.refresh();
          },
        });

        intro
          .to("[data-opening-meta]", {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
          })
          .to(
            "[data-opening-mark]",
            {
              autoAlpha: 1,
              clipPath: visibleClip,
              scaleY: 1,
              duration: 1.1,
              ease: "power4.out",
            },
            0.12,
          )
          .to(
            "[data-opening-progress]",
            {
              scaleX: 1,
              duration: 1.25,
              ease: "power3.inOut",
            },
            0.22,
          )
          .to(
            "[data-opening-meta], [data-opening-mark]",
            {
              yPercent: -115,
              duration: 0.9,
              stagger: 0.06,
              ease: "power3.inOut",
            },
            1.05,
          )
          .to(
            opening,
            {
              clipPath: hiddenClip,
              duration: 1.35,
              ease: "expo.inOut",
            },
            1.18,
          )
          .set(opening, { display: "none" })
          .to(
            heroNav,
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
            1.28,
          )
          .to(
            heroTitle,
            {
              clipPath: visibleClip,
              y: 0,
              scaleY: 1,
              duration: 1.45,
              ease: "expo.out",
            },
            1.38,
          )
          .to(
            heroLines,
            {
              yPercent: 0,
              rotate: 0,
              scaleY: 1,
              duration: 1.8,
              stagger: 0.13,
              ease: "expo.out",
            },
            1.42,
          )
          .to(
            heroPortrait,
            {
              autoAlpha: 1,
              clipPath: visibleClip,
              y: 0,
              scale: 1,
              duration: 1.65,
              ease: "expo.out",
            },
            1.58,
          )
          .to(
            heroCopy,
            {
              autoAlpha: 1,
              y: 0,
              clipPath: visibleClip,
              duration: 1.25,
              ease: "power4.out",
            },
            1.76,
          );
      } else if (opening) {
        gsap.set(opening, { display: "none" });
        gsap.set(
          [
            heroNav,
            heroTitle,
            ...heroLines,
            heroPortrait,
            heroCopy,
          ].filter(Boolean),
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            clipPath: visibleClip,
            clearProps: "transform,clipPath",
          },
        );
      }

      const marqueeSection = root.querySelector<HTMLElement>(
        "[data-marquee-section]",
      );
      if (marqueeSection) {
        gsap.fromTo(
          marqueeSection,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            y: 54,
          },
          {
            clipPath: visibleClip,
            y: 0,
            duration: 1.55,
            ease: "expo.out",
            scrollTrigger: {
              trigger: marqueeSection,
              start: "top 92%",
              once: true,
            },
          },
        );
      }

      const sectionHeadings = gsap.utils.toArray<HTMLElement>(
        "[data-section]",
        root,
      );

      sectionHeadings.forEach((section) => {
        const heading = section.querySelector<HTMLElement>(".heading-reveal");
        const kicker = section.querySelector<HTMLElement>(".section-kicker");
        const ghost = section.querySelector<HTMLElement>(".section-ghost");

        if (!heading && !kicker && !ghost) return;

        if (ghost) {
          gsap.set(ghost, {
            autoAlpha: 0,
            xPercent: -8,
            scaleX: 1.18,
            clipPath: "inset(0% 100% 0% 0%)",
            transformOrigin: "0% 50%",
          });
        }
        if (kicker) {
          gsap.set(kicker, {
            autoAlpha: 0,
            x: -34,
            clipPath: "inset(0% 100% 0% 0%)",
          });
        }
        if (heading) {
          gsap.set(heading, {
            y: 66,
            clipPath: hiddenClip,
            scaleY: 1.06,
            transformOrigin: "50% 100%",
          });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        if (ghost) {
          timeline.to(
            ghost,
            {
              autoAlpha: 1,
              xPercent: 0,
              scaleX: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.45,
              ease: "expo.out",
            },
            0,
          );
        }
        if (kicker) {
          timeline.to(
            kicker,
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.05,
              ease: "power4.out",
            },
            0.12,
          );
        }
        if (heading) {
          timeline.to(
            heading,
            {
              y: 0,
              clipPath: visibleClip,
              scaleY: 1,
              duration: 1.45,
              ease: "expo.out",
            },
            0.28,
          );
        }
      });

      gsap.utils
        .toArray<HTMLElement>(".stagger-group", root)
        .forEach((group) => {
          const items = gsap.utils.toArray<HTMLElement>(
            ":scope > .stagger-item",
            group,
          );
          if (!items.length) return;

          gsap.set(items, {
            autoAlpha: 0,
            y: 54,
            scale: 0.985,
            clipPath: hiddenClip,
            transformOrigin: "50% 100%",
          });

          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            clipPath: visibleClip,
            duration: 1.3,
            stagger: 0.16,
            ease: "expo.out",
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: true,
            },
            onComplete: () => {
              gsap.set(items, {
                clearProps:
                  "transform,opacity,visibility,clipPath,will-change",
              });
            },
          });
        });

      gsap.utils
        .toArray<HTMLElement>("[data-media-reveal]", root)
        .forEach((media) => {
          gsap.fromTo(
            media,
            {
              clipPath: hiddenClip,
              scale: 1.035,
              y: 36,
            },
            {
              clipPath: visibleClip,
              scale: 1,
              y: 0,
              duration: 1.5,
              ease: "expo.out",
              scrollTrigger: {
                trigger: media,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

      gsap.utils
        .toArray<HTMLElement>("img[data-parallax]", root)
        .forEach((image) => {
          const depth = readNumber(image, "parallax", 0.12);
          gsap.fromTo(
            image,
            { yPercent: depth * -7, scale: 1.025 },
            {
              yPercent: depth * 7,
              scale: 1.025,
              ease: "none",
              scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            },
          );
        });

      gsap.utils
        .toArray<HTMLElement>("[data-reveal]", root)
        .filter(
          (element) =>
            !element.closest("[data-hero-section]") &&
            !element.matches(".heading-reveal, .section-kicker") &&
            !element.closest(".stagger-group"),
        )
        .forEach((element) => {
          const x = readNumber(element, "revealX", 0);
          const y = readNumber(element, "revealY", 30);
          const delay = readNumber(element, "revealDelay", 0);
          const duration = Math.max(
            1.05,
            readNumber(element, "revealDuration", 0.7) * 1.25,
          );
          const startClip =
            x < 0
              ? "inset(0% 100% 0% 0%)"
              : x > 0
                ? "inset(0% 0% 0% 100%)"
                : y < 0
                  ? hiddenClip
                  : "inset(100% 0% 0% 0%)";

          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              x,
              y,
              clipPath: startClip,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              clipPath: visibleClip,
              duration,
              delay: delay * 0.35,
              ease: "expo.out",
              scrollTrigger: {
                trigger: element,
                start: "top 89%",
                once: true,
              },
            },
          );
        });
    }, root);

    const refreshAfterFonts = () => {
      if (disposed) return;
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    document.fonts?.ready.then(refreshAfterFonts).catch(() => undefined);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(refreshFrame);
      document.body.style.overflow = previousOverflow;
      context.revert();
    };
  }, [rootRef]);
}
