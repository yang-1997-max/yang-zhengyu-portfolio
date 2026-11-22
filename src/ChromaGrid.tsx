import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

export type ChromaGridItem = {
  image: string;
  video?: string;
  title: string;
  subtitle: string;
  accent: string;
  url?: string;
};

type ChromaGridProps = {
  items: ChromaGridItem[];
  columns?: number;
  radius?: number;
  className?: string;
};

const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function ChromaTile({
  item,
  index,
  radius,
  onOpenVideo,
}: {
  item: ChromaGridItem;
  index: number;
  radius: number;
  onOpenVideo: (item: ChromaGridItem) => void;
}) {
  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--chroma-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--chroma-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  const resetSpotlight = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--chroma-x", "50%");
    event.currentTarget.style.setProperty("--chroma-y", "50%");
  };

  const content = (
    <>
      {item.video ? (
        <video
          src={item.video}
          poster={item.image}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-label={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
      ) : (
        <>
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale-[0.42] transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          <span
            className="chroma-tile__color absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url("${item.image}")`,
              maskImage: `radial-gradient(circle ${radius}px at var(--chroma-x) var(--chroma-y), #000 0%, rgba(0,0,0,.78) 34%, transparent 82%)`,
              WebkitMaskImage: `radial-gradient(circle ${radius}px at var(--chroma-x) var(--chroma-y), #000 0%, rgba(0,0,0,.78) 34%, transparent 82%)`,
            }}
          />
        </>
      )}
      <span
        className="chroma-tile__glow absolute inset-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle ${Math.round(
            radius * 0.72,
          )}px at var(--chroma-x) var(--chroma-y), ${item.accent}55, transparent 72%)`,
        }}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/8 to-transparent" />
      <span className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
        <span>
          <span className="block text-lg font-medium leading-tight text-white sm:text-xl">
            {item.title}
          </span>
          <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.18em] text-white/55">
            {item.subtitle}
          </span>
        </span>
        <span
          className={`mb-1 flex shrink-0 items-center justify-center ${
            item.video
              ? "h-8 w-8 rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md"
              : "h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
          }`}
          style={
            item.video
              ? undefined
              : { backgroundColor: item.accent, color: item.accent }
          }
        >
          {item.video ? <Maximize2 size={14} aria-hidden="true" /> : null}
        </span>
      </span>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 34, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.58,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerMove={updateSpotlight}
      onPointerLeave={resetSpotlight}
      role={item.video ? "button" : undefined}
      tabIndex={item.video ? 0 : undefined}
      onClick={() => item.video && onOpenVideo(item)}
      onKeyDown={(event) => {
        if (!item.video) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenVideo(item);
        }
      }}
      className={`chroma-tile group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10 bg-[#151515] shadow-[0_20px_55px_rgba(0,0,0,0.22)] outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#D7E2EA] ${
        item.video ? "cursor-zoom-in" : ""
      }`}
      style={
        {
          "--chroma-accent": item.accent,
          "--chroma-x": "50%",
          "--chroma-y": "50%",
        } as CSSProperties
      }
    >
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-20"
          aria-label={`打开 ${item.title}`}
        >
          <span className="sr-only">{item.title}</span>
        </a>
      ) : null}
      {content}
    </motion.article>
  );
}

export default function ChromaGrid({
  items,
  columns = 3,
  radius = 260,
  className = "",
}: ChromaGridProps) {
  const [activeVideo, setActiveVideo] = useState<ChromaGridItem | null>(null);

  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  return (
    <>
      <div
        className={`grid gap-3 sm:gap-4 ${
          columnClasses[columns] ?? columnClasses[3]
        } ${className}`}
      >
        {items.map((item, index) => (
          <ChromaTile
            key={`${item.image}-${item.title}`}
            item={item}
            index={index}
            radius={radius}
            onOpenVideo={setActiveVideo}
          />
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {activeVideo?.video ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
                  onClick={() => setActiveVideo(null)}
                >
                  <button
                    type="button"
                    aria-label="关闭航拍视频"
                    onClick={() => setActiveVideo(null)}
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition-colors hover:bg-white/10 sm:right-7 sm:top-7"
                  >
                    <X size={20} />
                  </button>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <video
                      src={activeVideo.video}
                      poster={activeVideo.image}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="max-h-[82vh] w-full rounded-2xl bg-black object-contain"
                    />
                    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/75">
                      <span>{activeVideo.title}</span>
                      <span className="text-xs tracking-[0.16em] text-white/35">
                        {activeVideo.subtitle}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
