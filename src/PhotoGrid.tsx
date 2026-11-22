import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

export type PhotoGridItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  label: string;
};

export default function PhotoGrid({ items }: { items: PhotoGridItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const currentIndex = activeIndex ?? 0;

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + items.length) % items.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % items.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              type: "spring",
              stiffness: 165,
              damping: 17,
              delay: index * 0.06,
            }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-white/10 bg-[#151515] text-left shadow-[0_20px_55px_rgba(0,0,0,0.2)] outline-none transition-colors duration-300 hover:border-[#D7E2EA]/55 focus-visible:ring-2 focus-visible:ring-[#D7E2EA]"
            aria-label={`查看大图：${item.title}`}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/18 to-transparent" />
            <span className="absolute inset-x-5 top-5 flex items-center justify-between text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white/55">
              <span>{item.label}</span>
              <Expand
                size={15}
                className="translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </span>
            <span className="absolute inset-x-5 bottom-5">
              <span className="block text-xl font-medium leading-tight text-white sm:text-2xl">
                {item.title}
              </span>
              <span className="mt-2 block text-xs font-light leading-relaxed text-white/60 sm:text-sm">
                {item.subtitle}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {activeItem ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
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
                        (currentIndex - 1 + items.length) % items.length,
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
                      setActiveIndex((currentIndex + 1) % items.length);
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
                    className="w-full max-w-6xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <img
                      src={activeItem.image}
                      alt={activeItem.title}
                      className="max-h-[82vh] w-full rounded-2xl object-contain"
                    />
                    <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-white/75">
                      <span>
                        {activeItem.title} · {activeItem.subtitle}
                      </span>
                      <span className="text-xs tracking-[0.16em] text-white/35">
                        {currentIndex + 1} / {items.length}
                      </span>
                    </figcaption>
                  </motion.figure>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
