import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";

type SplitTextProps = {
  text: string;
  className?: string;
  effect?: "rise" | "fade";
  splitType?: "chars" | "words";
  delay?: number;
  duration?: number;
  staggerFrom?: "start" | "center" | "end" | "random";
  trigger?: "mount" | "view";
  hoverEffect?: "lift" | "none";
  loop?: boolean;
  loopDelay?: number;
  mask?: boolean;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  effect = "rise",
  splitType = "chars",
  delay = 50,
  duration = 1.25,
  staggerFrom = "start",
  trigger = "view",
  hoverEffect = "lift",
  loop = false,
  loopDelay = 1.5,
  mask = false,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, {
    once: !loop,
    amount: threshold,
    margin: rootMargin as `${number}px`,
  });
  const [animationCycle, setAnimationCycle] = useState(0);
  const shouldAnimate = trigger === "mount" || isInView;

  const items = useMemo(() => {
    if (splitType === "words") {
      return text.split(/\s+/).filter(Boolean);
    }
    return Array.from(text);
  }, [splitType, text]);

  useEffect(() => {
    if (!loop || !shouldAnimate) return;
    const timer = window.setTimeout(() => {
      setAnimationCycle((current) => current + 1);
    }, (items.length * delay + duration * 1000 + loopDelay * 1000));
    return () => window.clearTimeout(timer);
  }, [delay, duration, items.length, loop, loopDelay, shouldAnimate]);

  const itemIndexByRender = (index: number) => {
    if (staggerFrom === "end") return items.length - 1 - index;
    if (staggerFrom === "center") {
      return Math.abs(index - (items.length - 1) / 2);
    }
    if (staggerFrom === "random") {
      return Math.abs(Math.sin((index + 1) * 12.9898) * 43758.5453) % 1;
    }
    return index;
  };

  const initial =
    effect === "rise"
      ? { opacity: 0, y: "0.8em", rotateZ: 2 }
      : { opacity: 0, y: 0, rotateZ: 0 };

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center ${className}`}
      aria-label={text}
      style={
        {
          justifyContent:
            textAlign === "left"
              ? "flex-start"
              : textAlign === "right"
                ? "flex-end"
                : "center",
          textAlign,
        } as CSSProperties
      }
    >
      {items.map((item, index) => {
        const delayIndex = itemIndexByRender(index);
        const letter = item === " " ? "\u00A0" : item;

        return (
          <motion.span
            key={`${animationCycle}-${item}-${index}`}
            aria-hidden="true"
            initial={initial}
            animate={
              shouldAnimate
                ? { opacity: 1, y: 0, rotateZ: 0 }
                : initial
            }
            transition={{
              duration,
              delay: delayIndex * (delay / 1000),
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={
              hoverEffect === "lift"
                ? { y: -5, scale: 1.045, transition: { duration: 0.18 } }
                : undefined
            }
            onAnimationComplete={() => {
              if (index === items.length - 1) {
                onLetterAnimationComplete?.();
              }
            }}
            className={mask ? "inline-block overflow-hidden" : "inline-block"}
          >
            <span className={mask ? "inline-block" : undefined}>{letter}</span>
          </motion.span>
        );
      })}
    </span>
  );
}
