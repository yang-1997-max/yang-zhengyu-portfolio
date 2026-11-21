import { useEffect, useRef, useState } from "react";
import "./CircleGallery.css";

function CircleGallery({ items }) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startRotation: 0,
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let previous = performance.now();

    const tick = (now) => {
      const delta = Math.min(48, now - previous);
      previous = now;
      if (!reduceMotion && !dragRef.current.active) {
        setRotation((current) => current + delta * 0.008);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const startDrag = (event) => {
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startRotation: rotation,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!dragRef.current.active) return;
    setRotation(
      dragRef.current.startRotation +
        (event.clientX - dragRef.current.startX) * 0.42,
    );
  };

  const endDrag = (event) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      className={`circle-gallery${dragging ? " is-dragging" : ""}`}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="group"
      aria-label="常用制作软件，拖动可旋转"
    >
      <span className="circle-gallery__orbit" aria-hidden="true" />
      <span className="circle-gallery__orbit circle-gallery__orbit--inner" aria-hidden="true" />
      {items.map((item, index) => {
        const angle =
          ((rotation + (index * 360) / items.length) * Math.PI) / 180;
        const depth = (Math.cos(angle) + 1) / 2;
        const x = Math.sin(angle) * 142;
        const y = Math.cos(angle) * 48;
        const z = Math.cos(angle) * 82;
        const scale = 0.7 + depth * 0.3;
        const opacity = 0.6 + depth * 0.4;
        const rotationOffset = Math.sin(angle) * 5;

        return (
          <div
            className="circle-gallery__item"
            key={item.name}
            aria-label={item.name}
            style={{
              "--orbit-x": `${x}px`,
              "--orbit-y": `${y}px`,
              "--orbit-z": `${z}px`,
              "--orbit-scale": scale,
              "--orbit-opacity": opacity,
              "--orbit-rotation": `${rotationOffset}deg`,
              "--orbit-index": Math.round(depth * 100),
            }}
          >
            <img src={item.icon} alt="" draggable={false} />
          </div>
        );
      })}
      <span className="circle-gallery__center" aria-hidden="true" />
    </div>
  );
}

export default CircleGallery;
