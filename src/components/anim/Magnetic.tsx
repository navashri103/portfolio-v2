"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Magnetic attraction wrapper — children drift toward the pointer
 * within `strength` px, then spring home on leave.
 */
export default function Magnetic({
  children,
  strength = 18,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      x.set(relX * strength);
      y.set(relY * strength);
    },
    [reduced, strength, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
