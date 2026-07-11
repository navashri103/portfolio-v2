"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * 3D perspective tilt (≤6°) that tracks the pointer, with a springy
 * return. Purely transform-based — no layout cost.
 */
export default function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width);
      py.set((e.clientY - rect.top) / rect.height);
    },
    [reduced, px, py]
  );

  const onLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: "preserve-3d" }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
