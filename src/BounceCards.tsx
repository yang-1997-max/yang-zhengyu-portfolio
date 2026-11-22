import { useState } from "react";
import { motion } from "framer-motion";

type BounceCardsProps = {
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  spread?: number;
  rotation?: number;
  arc?: number;
  pushDistance?: number;
  hoverScale?: number;
  bounciness?: number;
  animationDelay?: number;
  animationStagger?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  enableHover?: boolean;
  className?: string;
};

export default function BounceCards({
  images,
  containerWidth = 500,
  containerHeight = 320,
  cardSize = 200,
  spread = 85,
  rotation = 10,
  arc = 0,
  pushDistance = 160,
  hoverScale = 1.06,
  bounciness = 0.6,
  animationDelay = 0.5,
  animationStagger = 0.06,
  borderWidth = 5,
  borderColor = "#ffffff",
  radius = 25,
  shadow = true,
  enableHover = true,
  className = "",
}: BounceCardsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const centerIndex = (images.length - 1) / 2;
  const availableSpread = Math.max(
    4,
    (containerWidth - Math.min(cardSize, containerWidth * 0.5)) /
      Math.max(images.length - 1, 1),
  );
  const effectiveSpread = Math.min(spread, availableSpread);
  const effectiveRotation = Math.min(
    rotation,
    12 / Math.max(centerIndex, 1),
  );
  const restSpacing =
    images.length > 5 ? Math.max(1.5, effectiveSpread * 0.16) : 18;

  return (
    <motion.div
      className={`relative mx-auto flex items-center justify-center ${className}`}
      style={{
        width: `min(${containerWidth}px, 100%)`,
        height: `${containerHeight}px`,
      }}
      onHoverStart={() => enableHover && setIsExpanded(true)}
      onHoverEnd={() => {
        setIsExpanded(false);
        setHoveredIndex(null);
      }}
      onPointerLeave={() => {
        setIsExpanded(false);
        setHoveredIndex(null);
      }}
    >
      {images.map((image, index) => {
        const offset = index - centerIndex;
        const normalizedOffset = centerIndex ? offset / centerIndex : 0;
        const expanded = enableHover && isExpanded;
        const individualLift =
          hoveredIndex === index ? -Math.min(pushDistance * 0.13, 22) : 0;

        return (
          <motion.img
            key={`${image}-${index}`}
            src={image}
            alt=""
            draggable={false}
            loading="lazy"
            initial={{
              opacity: 0,
              y: 120,
              scale: 0.72,
              rotate: offset * rotation * 0.2,
            }}
            animate={{
              opacity: 1,
              x: expanded ? offset * effectiveSpread : offset * restSpacing,
              y:
                (expanded ? Math.abs(normalizedOffset) * arc : 0) +
                individualLift,
              scale:
                hoveredIndex === index && expanded ? hoverScale * 1.025 : 1,
              rotate: expanded
                ? offset * effectiveRotation
                : offset * effectiveRotation * 0.2,
              zIndex:
                hoveredIndex === index
                  ? images.length + 2
                  : images.length - index,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              mass: 0.7,
              bounce: bounciness,
              delay: animationDelay + index * animationStagger,
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="absolute select-none object-cover"
            style={{
              width: `min(${cardSize}px, 46vw)`,
              height: `min(${cardSize}px, 46vw)`,
              borderRadius: `${radius}px`,
              border: `${borderWidth}px solid ${borderColor}`,
              boxShadow: shadow
                ? "0 28px 58px rgba(0, 0, 0, 0.42)"
                : undefined,
              transformOrigin: "center bottom",
            }}
          />
        );
      })}
    </motion.div>
  );
}
