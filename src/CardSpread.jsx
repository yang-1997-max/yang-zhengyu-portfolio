import { useEffect, useRef, useState } from "react";
import "./CardSpread.css";

const PUSH = 3.6;
const PUSH_REACH = 3;
const LIFT = 28;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function CardSpread({ cards, onSelect }) {
  const stageRef = useRef(null);
  const [fit, setFit] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const compact = cards.length > 8;
  const cardWidth = compact ? 204 : 248;
  const cardHeight = compact ? 308 : 376;
  const cardRadius = compact ? 16 : 18;
  const fanRadius = compact ? 610 : 545;
  const arc = compact ? 104 : 88;
  const centerIndex = Math.floor(cards.length / 2);
  const currentIndex = hoveredIndex ?? centerIndex;
  const currentCard = cards[currentIndex];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateFit = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const fanHalfWidth =
        Math.sin((arc / 2) * (Math.PI / 180)) * fanRadius;
      const fanWidth = fanHalfWidth * 2 + cardWidth * 1.25;
      const sideDrop =
        fanRadius * (1 - Math.cos((arc / 2) * (Math.PI / 180)));
      const fanHeight = cardHeight + sideDrop * 1.35;
      setFit(
        clamp(
          Math.min((width - 36) / fanWidth, (height - 24) / fanHeight, 1),
          0.36,
          1,
        ),
      );
    };

    updateFit();
    const observer = new ResizeObserver(updateFit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [arc, cardHeight, cardWidth, fanRadius]);

  const cardsInFan = cards.map((card, index) => {
    const baseAngle =
      (index / Math.max(1, cards.length - 1) - 0.5) * arc;
    let pushAngle = 0;

    if (hoveredIndex !== null && index !== hoveredIndex) {
      const distance = Math.abs(index - hoveredIndex);
      if (distance <= PUSH_REACH) {
        const direction = index < hoveredIndex ? -1 : 1;
        const distanceFalloff = 1 - (distance - 1) / (PUSH_REACH + 1);
        pushAngle = direction * PUSH * distanceFalloff;
      }
    }

    const angle = baseAngle + pushAngle;
    const radians = (angle * Math.PI) / 180;
    const isHovered = hoveredIndex === index;
    const shouldDim =
      hoveredIndex !== null && hoveredIndex !== index;
    const lift = isHovered ? LIFT : 0;
    const x = Math.sin(radians) * (fanRadius + lift);
    const y =
      fanRadius -
      Math.cos(radians) * (fanRadius + lift);
    const zIndex = isHovered
      ? 100
      : cards.length - Math.abs(index - centerIndex);
    const titleSize = clamp(
      ((cardWidth - 44) / Math.max(card.title.length, 4)) * 0.94,
      14,
      compact ? 26 : 31,
    );

    return {
      ...card,
      index,
      style: {
        "--card-x": `${x}px`,
        "--card-y": `${y}px`,
        "--card-rotation": `${angle * 0.7}deg`,
        "--card-opacity": shouldDim ? "0.68" : "1",
        "--card-z": zIndex,
        "--card-title-size": `${titleSize}px`,
      },
    };
  });

  return (
    <div className="card-spread">
      <div className="card-spread__glow" aria-hidden="true" />
      <div
        ref={stageRef}
        className="card-spread__stage"
        onPointerLeave={() => setHoveredIndex(null)}
      >
        <div
          className="card-spread__fan"
          style={{
            "--card-width": `${cardWidth}px`,
            "--card-height": `${cardHeight}px`,
            "--card-radius": `${cardRadius}px`,
            transform: `translate(-50%, -50%) scale(${fit})`,
          }}
        >
          {cardsInFan.map((card) => (
            <button
              className={`card-spread__card frame-border${
                hoveredIndex === card.index ? " is-hovered" : ""
              }`}
              key={card.title}
              type="button"
              style={card.style}
              onPointerEnter={() => setHoveredIndex(card.index)}
              onFocus={() => setHoveredIndex(card.index)}
              onClick={() => onSelect(card)}
              aria-label={`查看项目：${card.title}`}
            >
              <span className="card-spread__meta-top">
                <span>{card.number}</span>
              </span>
              <span className="card-spread__media">
                <img
                  src={card.image}
                  alt={`${card.title}项目画面`}
                  draggable={false}
                  loading="lazy"
                />
              </span>
              <span className="card-spread__title">{card.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card-spread__status" aria-live="polite">
        <div className="card-spread__identity">
          <span>{currentCard?.number}</span>
          <div>
            <strong>{currentCard?.title}</strong>
          </div>
        </div>
        <div className="card-spread__instructions">
          <span>HOVER TO SPREAD</span>
          <span>CLICK TO EXPLORE ↗</span>
        </div>
      </div>
    </div>
  );
}

export default CardSpread;
