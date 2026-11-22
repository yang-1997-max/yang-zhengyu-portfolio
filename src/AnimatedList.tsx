import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export type AnimatedListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  image?: string;
};

type AnimatedListProps = {
  items: AnimatedListItem[];
  onItemSelect?: (item: AnimatedListItem, index: number) => void;
  selectedIndex?: number;
  animation?: "pop";
  theme?: "dark" | "light";
  className?: string;
  emptyState?: ReactNode;
};

function AnimatedListItem({
  item,
  index,
  selected,
  onSelect,
  root,
  theme,
}: {
  item: AnimatedListItem;
  index: number;
  selected: boolean;
  onSelect: () => void;
  root: React.RefObject<HTMLDivElement | null>;
  theme: "dark" | "light";
}) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const isInView = useInView(itemRef, {
    root,
    amount: 0.55,
    once: false,
  });

  const dark = theme === "dark";

  return (
    <motion.button
      ref={itemRef}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      initial={false}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: selected ? 1.025 : 1,
              y: 0,
              filter: "blur(0px)",
            }
          : {
              opacity: 0.28,
              scale: 0.92,
              y: 10,
              filter: "blur(2px)",
            }
      }
      whileHover={{ scale: selected ? 1.035 : 1.018 }}
      whileTap={{ scale: 0.975 }}
      transition={{
        type: "spring",
        stiffness: 310,
        damping: 20,
        mass: 0.72,
      }}
      className={`group flex min-w-[156px] items-center gap-2 rounded-2xl border p-2 text-left md:min-w-0 ${
        selected
          ? dark
            ? "border-[#D7E2EA] bg-[#D7E2EA]/10 shadow-[0_0_24px_rgba(215,226,234,0.12)]"
            : "border-[#0C0C0C] bg-black/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          : dark
            ? "border-white/10 bg-white/[0.025] hover:border-white/25"
            : "border-black/10 bg-black/[0.015] hover:border-black/25"
      }`}
    >
      {item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-12 w-20 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.58rem] ${
            dark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/60"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`block truncate text-xs font-medium ${
              dark ? "text-[#D7E2EA]" : "text-[#0C0C0C]"
            }`}
          >
            {item.title}
          </span>
          {item.meta ? (
            <span
              className={`shrink-0 text-[0.52rem] tracking-[0.12em] ${
                dark ? "text-[#D7E2EA]/35" : "text-black/35"
              }`}
            >
              {item.meta}
            </span>
          ) : null}
        </span>
        {item.description ? (
          <span
            className={`mt-1 block text-[0.58rem] uppercase tracking-[0.16em] ${
              dark ? "text-[#D7E2EA]/45" : "text-black/45"
            }`}
          >
            {item.description}
          </span>
        ) : null}
      </span>
    </motion.button>
  );
}

export default function AnimatedList({
  items,
  onItemSelect,
  selectedIndex,
  animation = "pop",
  theme = "dark",
  className = "",
  emptyState = null,
}: AnimatedListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  if (!items.length) return <>{emptyState}</>;

  return (
    <div
      ref={listRef}
      className={`animated-list-scroll flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pr-2 md:pb-0 ${className}`}
      data-animation={animation}
      data-theme={theme}
    >
      {items.map((item, index) => (
        <AnimatedListItem
          key={item.id}
          item={item}
          index={index}
          selected={selectedIndex === index}
          onSelect={() => onItemSelect?.(item, index)}
          root={listRef}
          theme={theme}
        />
      ))}
    </div>
  );
}
