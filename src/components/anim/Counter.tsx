"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/** Number that springs from 0 to `value` when scrolled into view. */
export default function Counter({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.jump(value);
      spring.jump(value);
      return;
    }
    mv.set(value);
  }, [inView, reduced, value, mv, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${v.toFixed(decimals)}${suffix}`;
      }
    });
    return unsub;
  }, [spring, decimals, suffix]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {`${(0).toFixed(decimals)}${suffix}`}
    </span>
  );
}
