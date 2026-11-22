import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type SpecularButtonProps = {
  children: ReactNode;
  href?: string;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  followMouse?: boolean;
  proximity?: number;
  className?: string;
  onClick?: () => void;
};

type SpecularStyle = CSSProperties & Record<`--${string}`, string | number>;

const sizeClasses = {
  sm: "px-5 py-2.5 text-xs sm:px-6 sm:py-3",
  md: "px-7 py-3 text-sm sm:px-8 sm:py-3.5",
  lg: "px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base",
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(value)) return "255, 255, 255";

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ].join(", ");
}

export default function SpecularButton({
  children,
  href,
  size = "lg",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0.04,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  followMouse = true,
  proximity = 250,
  className = "",
  onClick,
}: SpecularButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = anchorRef.current ?? buttonRef.current;
    if (!element) return;

    const updateSpotlight = (event: PointerEvent) => {
      if (!followMouse) return;

      const bounds = element.getBoundingClientRect();
      const distanceX = Math.max(
        bounds.left - event.clientX,
        0,
        event.clientX - bounds.right,
      );
      const distanceY = Math.max(
        bounds.top - event.clientY,
        0,
        event.clientY - bounds.bottom,
      );
      const distance = Math.hypot(distanceX, distanceY);
      const proximityStrength = Math.max(0, 1 - distance / proximity);
      const strength =
        idleIntensity + (intensity - idleIntensity) * proximityStrength;

      element.style.setProperty(
        "--spec-x",
        `${event.clientX - bounds.left}px`,
      );
      element.style.setProperty(
        "--spec-y",
        `${event.clientY - bounds.top}px`,
      );
      element.style.setProperty("--spec-strength", strength.toFixed(3));
      element.style.setProperty(
        "--spec-glow-opacity",
        (0.025 + strength * 0.1).toFixed(3),
      );
      element.style.setProperty(
        "--spec-glow-size",
        `${Math.round(18 + glow * 24)}px`,
      );
    };

    element.style.setProperty("--spec-strength", idleIntensity.toFixed(3));
    element.style.setProperty(
      "--spec-glow-opacity",
      (0.025 + idleIntensity * 0.1).toFixed(3),
    );
    element.style.setProperty(
      "--spec-glow-size",
      `${Math.round(18 + glow * 24)}px`,
    );

    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateSpotlight);
  }, [followMouse, glow, idleIntensity, intensity, proximity]);

  const style: SpecularStyle = {
    "--spec-radius": `${radius}px`,
    "--spec-tint": `rgba(${hexToRgb(tint)}, ${tintOpacity})`,
    "--spec-text": textColor,
    "--spec-line-rgb": hexToRgb(lineColor),
    "--spec-base": baseColor,
    "--spec-shine-size": `${shineSize}px`,
    "--spec-shine-fade": `${shineFade}px`,
    "--spec-thickness": `${thickness}px`,
    "--spec-glow-size": `${Math.round(18 + glow * 24)}px`,
    "--spec-glow-opacity": "0.06",
    "--spec-strength": idleIntensity,
    "--spec-x": "50%",
    "--spec-y": "50%",
  };

  const content = (
    <>
      <span className="specular-button__border" aria-hidden="true" />
      <span className="specular-button__shine" aria-hidden="true" />
      <span className="relative z-[1]">{children}</span>
    </>
  );

  const classes = `specular-button ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a
        ref={anchorRef}
        href={href}
        className={classes}
        style={style}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
