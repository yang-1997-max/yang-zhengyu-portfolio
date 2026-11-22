import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

type TextTypeProps = {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  deleteMode?: "backspace";
  typeEffect?: "fade" | "none";
  mistakes?: number;
  cursorStyle?: "bar" | "block" | "underscore";
  cursorGlide?: boolean;
  showCursor?: boolean;
  className?: string;
};

const mistakePool = "这是一个故事画面节奏情绪";

export default function TextType({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  deletingSpeed = 50,
  deleteMode = "backspace",
  typeEffect = "fade",
  mistakes = 0,
  cursorStyle = "bar",
  cursorGlide = false,
  showCursor = true,
  className = "",
}: TextTypeProps) {
  const sequences = useMemo(
    () => (text.length ? text : [""]),
    [text],
  );
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMistake, setIsMistake] = useState(false);
  const target = sequences[sequenceIndex % sequences.length];

  useEffect(() => {
    let timer: number;

    if (isMistake) {
      timer = window.setTimeout(() => {
        setDisplayed((current) => current.slice(0, -1));
        setIsMistake(false);
      }, 220);
    } else if (!isDeleting && displayed.length === target.length) {
      timer = window.setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayed.length === 0) {
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setSequenceIndex((current) => (current + 1) % sequences.length);
      }, Math.max(120, deletingSpeed));
    } else if (isDeleting) {
      timer = window.setTimeout(() => {
        setDisplayed((current) => current.slice(0, -1));
      }, deletingSpeed);
    } else {
      const shouldMakeMistake =
        mistakes > 0 &&
        displayed.length > 3 &&
        displayed.length < target.length - 2 &&
        Math.random() < mistakes;

      timer = window.setTimeout(() => {
        if (shouldMakeMistake) {
          const wrongCharacter =
            mistakePool[Math.floor(Math.random() * mistakePool.length)];
          setDisplayed((current) => current + wrongCharacter);
          setIsMistake(true);
        } else {
          setDisplayed((current) => current + (target[current.length] ?? ""));
        }
      }, typingSpeed);
    }

    return () => window.clearTimeout(timer);
  }, [
    deleteMode,
    deletingSpeed,
    displayed,
    isDeleting,
    isMistake,
    mistakes,
    pauseDuration,
    sequences.length,
    target,
    typingSpeed,
  ]);

  const cursorClass =
    cursorStyle === "block"
      ? "h-[0.92em] w-[0.48em]"
      : cursorStyle === "underscore"
        ? "h-[2px] w-[0.62em] translate-y-[0.35em]"
        : "h-[0.92em] w-[2px]";

  return (
    <span
      className={`inline ${className}`}
      aria-label={target}
      style={
        {
          "--text-cursor-duration": cursorGlide ? "180ms" : "0ms",
        } as CSSProperties
      }
    >
      <span aria-hidden="true">
        {Array.from(displayed).map((character, index) =>
          typeEffect === "fade" ? (
            <motion.span
              key={`${index}-${character}`}
              initial={{ opacity: 0.15, filter: "blur(4px)", translateY: 3 }}
              animate={{ opacity: 1, filter: "blur(0px)", translateY: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={character === " " ? "inline" : "inline-block"}
            >
              {character === " " ? "\u00A0" : character}
            </motion.span>
          ) : (
            <span
              key={`${index}-${character}`}
              className={character === " " ? "inline" : "inline-block"}
            >
              {character === " " ? "\u00A0" : character}
            </span>
          ),
        )}
      </span>
      {showCursor ? (
        <span
          className={`ml-[0.08em] inline-block bg-[#D7E2EA] align-middle ${cursorClass}`}
          style={{
            transitionDuration: "var(--text-cursor-duration)",
            animation: "textTypeCursor 0.85s step-end infinite",
          }}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
