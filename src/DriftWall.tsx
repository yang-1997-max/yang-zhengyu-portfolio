import { useEffect, useRef, type CSSProperties } from "react";

type DriftWallItem = {
  image: string;
  title: string;
  href?: string;
};

type DriftWallProps = {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  lift?: number;
  fade?: number;
  dim?: number;
  overlayColor?: string;
  className?: string;
  pauseWhileScrolling?: boolean;
};

function colorWithAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return `rgba(6, 0, 16, ${alpha})`;
  }

  return `rgba(${Number.parseInt(value.slice(0, 2), 16)}, ${Number.parseInt(
    value.slice(2, 4),
    16,
  )}, ${Number.parseInt(value.slice(4, 6), 16)}, ${alpha})`;
}

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -14,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  overlayColor = "#060010",
  className = "",
  pauseWhileScrolling = true,
}: DriftWallProps) {
  const wallRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    const stage = stageRef.current;
    if (!wall || !stage) return;

    const move = (event: PointerEvent) => {
      const bounds = wall.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      stage.style.setProperty("--drift-shift-x", `${x * parallax * 5}deg`);
      stage.style.setProperty("--drift-shift-y", `${-y * parallax * 4}deg`);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [parallax]);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || !pauseWhileScrolling) return;

    let resumeTimer = 0;
    let resumeFrame = 0;

    const pauseTracks = () => {
      const bounds = wall.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      wall.classList.add("drift-wall--scroll-paused");
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resumeFrame = window.requestAnimationFrame(() => {
          wall.classList.remove("drift-wall--scroll-paused");
        });
      }, 160);
    };

    window.addEventListener("wheel", pauseTracks, { passive: true });
    window.addEventListener("scroll", pauseTracks, { passive: true });

    return () => {
      window.clearTimeout(resumeTimer);
      window.cancelAnimationFrame(resumeFrame);
      window.removeEventListener("wheel", pauseTracks);
      window.removeEventListener("scroll", pauseTracks);
      wall.classList.remove("drift-wall--scroll-paused");
    };
  }, [pauseWhileScrolling]);

  const columnItems = Array.from({ length: columns }, (_, columnIndex) => {
    const base = items.filter(
      (_, itemIndex) => itemIndex % columns === columnIndex,
    );
    const source = base.length ? base : items;
    return Array.from({ length: 10 }, (_, itemIndex) => {
      return source[itemIndex % source.length];
    });
  });

  return (
    <div
      ref={wallRef}
      className={`drift-wall pointer-events-none relative h-full w-full overflow-hidden ${className}`}
      style={
        {
          "--drift-perspective": `${perspective}px`,
          "--drift-tilt": `${tilt}deg`,
          "--drift-turn": `${turn}deg`,
          "--drift-gap": `${gap}px`,
          "--drift-depth": `${depth}px`,
          "--drift-lift": `${lift}px`,
          "--drift-fade": `${fade * 100}%`,
          "--drift-dim": dim,
          "--drift-overlay": overlayColor,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div ref={stageRef} className="drift-wall__stage">
        {columnItems.map((column, columnIndex) => {
          const columnDuration =
            (column.length * (tileHeight + gap)) /
            Math.max(8, speed * (1 + ((columnIndex % 3) - 1) * variance));

          return (
            <div
              key={columnIndex}
              className="drift-wall__column"
              style={{
                width: `${tileWidth}px`,
                transform: `translateZ(${
                  depth * ((columnIndex % 3) - 1) * 0.28
                }px)`,
              }}
            >
              <div
                className={`drift-wall__track ${
                  direction === "down" ? "drift-wall__track--down" : ""
                }`}
                style={{ animationDuration: `${columnDuration}s` }}
              >
                {[...column, ...column].map((item, itemIndex) => (
                  <div
                    key={`${item.title}-${itemIndex}`}
                    className="drift-wall__tile"
                    style={{
                      width: `${tileWidth}px`,
                      height: `${tileHeight}px`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="drift-wall__overlay" />
      <div
        className="drift-wall__overlay drift-wall__overlay--radial"
        style={{
          background: `radial-gradient(circle at 50% 44%, transparent 0%, ${colorWithAlpha(
            overlayColor,
            0.08,
          )} 40%, ${colorWithAlpha(overlayColor, 0.76)} 100%)`,
        }}
      />
    </div>
  );
}
