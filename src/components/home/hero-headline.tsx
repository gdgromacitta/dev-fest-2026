"use client";

import { useEffect, useRef } from "react";

/** Scroll distance (px) over which the headline goes from wide/heavy to condensed/light. */
const RANGE = 520;
const WDTH = { from: 112, to: 40 };
const WGHT = { from: 850, to: 330 };

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wraps the hero title lines and maps scroll position onto Roboto Flex's
 * width and weight axes. Line lengths only ever shrink, so the layout never
 * reflows wider than its resting state. Skipped under prefers-reduced-motion.
 */
export function HeroHeadline({ children, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / RANGE));
      const wdth = WDTH.from + (WDTH.to - WDTH.from) * p;
      const wght = WGHT.from + (WGHT.to - WGHT.from) * p;
      el.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "opsz" 144`;
      el.style.fontWeight = String(Math.round(wght));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={ref} className={`hero-headline ${className ?? ""}`}>
      {children}
    </span>
  );
}
