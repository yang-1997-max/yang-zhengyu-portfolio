import { useState } from "react";
import { motion } from "framer-motion";

type StrokeTextProps = {
  text: string;
  strokeColor?: string;
  strokeStyle?: "solid" | "dashed";
  strokeWidth?: number;
  dashLength?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: "mount" | "viewport";
  fillMode?: "wipe" | "fade";
  wipeFrom?: "left" | "right";
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  marching?: boolean;
  hoverRedraw?: boolean;
  shadow?: boolean;
  fillColor?: string | null;
  shadowColor?: string | null;
  className?: string;
};

export default function StrokeText({
  text,
  strokeColor = "#A78BFA",
  strokeStyle = "solid",
  strokeWidth = 1.4,
  dashLength = 10,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  wipeFrom = "left",
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  marching = false,
  hoverRedraw = true,
  shadow = false,
  fillColor = null,
  shadowColor = null,
  className = "",
}: StrokeTextProps) {
  const [renderKey, setRenderKey] = useState(0);
  const characters = Array.from(text);
  const compactSize =
    characters.length > 24
      ? `clamp(1.5rem, 2.2vw, ${Math.min(fontSize, 44)}px)`
      : `clamp(2.5rem, 8vw, ${fontSize}px)`;
  const effectiveStagger = characters.length > 24 ? Math.min(stagger, 0.022) : stagger;
  const effectiveLetterSpacing =
    characters.length > 24 ? Math.max(letterSpacing, -1.1) : letterSpacing;
  const startClip = wipeFrom === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const endClip = "inset(0 0 0 0)";
  const resolvedFill = fillColor ?? "#D7E2EA";
  const resolvedShadow = shadow
    ? `0 0 22px ${shadowColor ?? strokeColor}`
    : "none";

  return (
    <span
      key={renderKey}
      className={`inline text-balance ${className}`}
      aria-label={text}
      onMouseEnter={() =>
        hoverRedraw ? setRenderKey((current) => current + 1) : undefined
      }
    >
      {characters.map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="relative inline-block"
          aria-hidden="true"
          style={{
            fontSize: compactSize,
            fontWeight,
            letterSpacing: `${effectiveLetterSpacing}px`,
            lineHeight: 1.08,
            textShadow: resolvedShadow,
          }}
        >
          <motion.span
            className="text-transparent"
            initial={{ clipPath: startClip, opacity: 0, y: 4 }}
            animate={{ clipPath: endClip, opacity: 1, y: 0 }}
            transition={{
              duration: drawDuration * 0.52,
              delay: index * effectiveStagger,
              ease: ease === "power2.out" ? [0.22, 1, 0.36, 1] : "easeOut",
            }}
            style={{
              WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
            }}
          >
            {character === " " ? "\u00A0" : character}
          </motion.span>
          <motion.span
            className="absolute inset-0"
            initial={
              fillMode === "wipe"
                ? { clipPath: startClip, opacity: 1 }
                : { opacity: 0 }
            }
            animate={
              fillMode === "wipe" ? { clipPath: endClip } : { opacity: 1 }
            }
            transition={{
              duration: fillMode === "wipe" ? drawDuration * 0.7 : drawDuration * 0.45,
              delay: fillDelay + index * effectiveStagger,
              ease: ease === "power2.out" ? [0.22, 1, 0.36, 1] : "easeOut",
            }}
            style={{ color: resolvedFill }}
          >
            {character === " " ? "\u00A0" : character}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
