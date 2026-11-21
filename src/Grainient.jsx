import { useEffect, useRef } from "react";
import "./Grainient.css";

function Grainient({
  colors = ["#070707", "#14100c", "#2f1d13", "#9b693a"],
  angle = 55,
  flow = 0.8,
  silk = 0.35,
  grainAmount = 0.08,
  speed = 1,
  variation = 0,
  className = "",
  style,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const onPointerMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      root.style.setProperty("--grainient-pointer-x", `${x * 42 * flow}px`);
      root.style.setProperty("--grainient-pointer-y", `${y * 34 * flow}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [flow]);

  const fallback = colors.length
    ? colors
    : ["#070707", "#14100c", "#2f1d13", "#9b693a"];
  const color0 = fallback[0];
  const color1 = fallback[1] ?? fallback[0];
  const color2 = fallback[2] ?? color1;
  const color3 = fallback[3] ?? color2;

  return (
    <div
      ref={rootRef}
      className={`grainient ${className}`.trim()}
      style={{
        "--grainient-color-0": color0,
        "--grainient-color-1": color1,
        "--grainient-color-2": color2,
        "--grainient-color-3": color3,
        "--grainient-angle": `${angle}deg`,
        "--grainient-flow": flow,
        "--grainient-silk": silk,
        "--grainient-grain": grainAmount,
        "--grainient-speed": `${Math.max(8, 20 / Math.max(speed, 0.1))}s`,
        "--grainient-offset": `${variation * 3.7}%`,
        ...style,
      }}
      aria-hidden="true"
    >
      <div className="grainient__flow">
        <div className="grainient__field" />
        <div className="grainient__wash grainient__wash--blue" />
        <div className="grainient__wash grainient__wash--warm" />
      </div>
      <div className="grainient__silk" />
      <div className="grainient__grain" />
      <div className="grainient__vignette" />
    </div>
  );
}

export default Grainient;
