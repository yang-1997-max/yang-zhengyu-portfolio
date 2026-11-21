import { useEffect } from "react";
import "./FrameBorder.css";

const FRAME_SELECTOR = ".frame-border";

function easeOut(value) {
  return 1 - (1 - value) ** 3;
}

function clearFrame(element) {
  element?.style.setProperty("--frame-border-opacity", "0");
}

function FrameBorder() {
  useEffect(() => {
    let activeFrame = null;

    const updateFrame = (event) => {
      const nextFrame = event.target?.closest?.(FRAME_SELECTOR) ?? null;

      if (activeFrame && activeFrame !== nextFrame) {
        clearFrame(activeFrame);
      }
      activeFrame = nextFrame;

      if (!nextFrame) return;

      const rect = nextFrame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
      const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
      const distances = [y, rect.height - y, x, rect.width - x];
      const nearest = Math.min(...distances);
      const threshold = Math.min(118, Math.max(68, Math.min(rect.width, rect.height) * 0.24));
      const strength = Math.max(0, 1 - nearest / threshold);

      if (strength <= 0.01) {
        clearFrame(nextFrame);
        return;
      }

      let edgeX = x;
      let edgeY = y;
      if (nearest === y) {
        edgeY = 0;
      } else if (nearest === rect.height - y) {
        edgeY = rect.height;
      } else if (nearest === x) {
        edgeX = 0;
      } else {
        edgeX = rect.width;
      }

      nextFrame.style.setProperty("--frame-border-x", `${edgeX}px`);
      nextFrame.style.setProperty("--frame-border-y", `${edgeY}px`);
      nextFrame.style.setProperty(
        "--frame-border-opacity",
        easeOut(strength).toFixed(3),
      );
    };

    const clearAll = () => {
      document.querySelectorAll(FRAME_SELECTOR).forEach(clearFrame);
      activeFrame = null;
    };

    window.addEventListener("pointermove", updateFrame, { passive: true });
    window.addEventListener("blur", clearAll);
    window.addEventListener("scroll", clearAll, { passive: true });
    document.documentElement.addEventListener("pointerleave", clearAll);

    return () => {
      window.removeEventListener("pointermove", updateFrame);
      window.removeEventListener("blur", clearAll);
      window.removeEventListener("scroll", clearAll);
      document.documentElement.removeEventListener("pointerleave", clearAll);
    };
  }, []);

  return null;
}

export default FrameBorder;
