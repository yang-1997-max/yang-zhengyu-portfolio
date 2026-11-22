import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, GripVertical, X } from "lucide-react";

export type MasonryItem = {
  id: string;
  img: string;
  width: number;
  height: number;
  title: string;
  url?: string;
};

type MasonryProps = {
  items: MasonryItem[];
  columnWidth?: number;
  gap?: number;
  radius?: number;
  animateFrom?: "bottom" | "top";
  hoverEffect?: "zoom" | "none";
  captions?: "hover" | "always" | "none";
  lightbox?: boolean;
  draggable?: boolean;
  className?: string;
};

export default function Masonry({
  items,
  columnWidth = 240,
  gap = 12,
  radius = 12,
  animateFrom = "bottom",
  hoverEffect = "zoom",
  captions = "hover",
  lightbox = true,
  draggable = true,
  className = "",
}: MasonryProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const draggedId = useRef<string | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + orderedItems.length) % orderedItems.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % orderedItems.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, orderedItems.length]);

  const activeItem = activeIndex === null ? null : orderedItems[activeIndex];
  const initialY = animateFrom === "bottom" ? 48 : -48;

  const handleDrop = (targetId: string) => {
    const sourceId = draggedId.current;
    if (!sourceId || sourceId === targetId) return;

    setOrderedItems((current) => {
      const sourceIndex = current.findIndex((item) => item.id === sourceId);
      const targetIndex = current.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    draggedId.current = null;
  };

  const lightboxContent = useMemo(() => {
    if (!activeItem || !lightbox) return null;
    const currentIndex = activeIndex as number;

    return (
      <motion.div
        key="masonry-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
        onClick={() => setActiveIndex(null)}
      >
        <button
          type="button"
          aria-label="关闭图片预览"
          onClick={() => setActiveIndex(null)}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/10 sm:right-7 sm:top-7"
        >
          <X size={20} />
        </button>
        <button
          type="button"
          aria-label="上一张"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex(
              (currentIndex - 1 + orderedItems.length) % orderedItems.length,
            );
          }}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/10 sm:left-7"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="下一张"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex((currentIndex + 1) % orderedItems.length);
          }}
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/10 sm:right-7"
        >
          <ChevronRight size={22} />
        </button>

        <motion.figure
          key={activeItem.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="max-w-[92vw]"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src={activeItem.img}
            alt={activeItem.title}
            className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain"
          />
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-white/75">
            <span>{activeItem.title}</span>
            <span className="text-xs tracking-[0.16em] text-white/35">
              {(activeIndex ?? 0) + 1} / {orderedItems.length}
            </span>
          </figcaption>
        </motion.figure>
      </motion.div>
    );
  }, [activeIndex, activeItem, lightbox, orderedItems.length]);

  return (
    <>
      <div
        className={`w-full ${className}`}
        style={{
          columnWidth: `${columnWidth}px`,
          columnGap: `${gap}px`,
        }}
      >
        {orderedItems.map((item, index) => (
          <motion.div
            key={item.id}
            role="button"
            tabIndex={0}
            draggable={draggable}
            aria-label={`预览：${item.title}`}
            initial={{ opacity: 0, y: initialY, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 14,
              mass: 0.7,
              bounce: 0.48,
              delay: Math.min(index * 0.035, 0.28),
            }}
            whileHover={
              hoverEffect === "zoom"
                ? {
                    scale: 1.035,
                    y: -6,
                    rotate: index % 2 === 0 ? -1.2 : 1.2,
                    zIndex: 3,
                  }
                : undefined
            }
            whileTap={hoverEffect === "zoom" ? { scale: 0.975 } : undefined}
            onClick={() => lightbox && setActiveIndex(index)}
            onKeyDown={(event) => {
              if (!lightbox) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
            onDragStart={(event) => {
              if (!draggable) return;
              const dragEvent = event as unknown as DragEvent<HTMLDivElement>;
              draggedId.current = item.id;
              dragEvent.dataTransfer.effectAllowed = "move";
              dragEvent.dataTransfer.setData("text/plain", item.id);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(item.id)}
            className="group relative inline-block w-full cursor-zoom-in break-inside-avoid overflow-hidden bg-white/[0.035] outline-none ring-[#D7E2EA]/0 transition-[box-shadow,ring] duration-300 focus-visible:ring-2"
            style={{
              aspectRatio: `${item.width} / ${item.height}`,
              marginBottom: `${gap}px`,
              borderRadius: `${radius}px`,
            }}
          >
            <motion.img
              src={item.img}
              alt={item.title}
              width={item.width}
              height={item.height}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
              whileHover={hoverEffect === "zoom" ? { scale: 1.07 } : undefined}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />

            {captions !== "none" ? (
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/25 to-transparent px-4 pb-4 pt-14 text-white transition-opacity duration-300 ${
                  captions === "hover"
                    ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                <span className="text-sm font-medium">{item.title}</span>
                {draggable ? (
                  <GripVertical
                    size={16}
                    className="shrink-0 text-white/50"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(<AnimatePresence>{lightboxContent}</AnimatePresence>, document.body)
        : null}
    </>
  );
}
