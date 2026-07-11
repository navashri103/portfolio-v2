"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const SPARKLE_COLORS = ["#ffc46b", "#f7f2ea", "#ffc46b", "#ff8a5c"];

/**
 * Custom cursor: a gold dot with a trailing ring that swells over
 * interactive elements — plus tiny four-point stars that sparkle off
 * the pointer as it moves. Nothing renders on touch devices or under
 * reduced motion.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion();
  const sparkleLayer = useRef<HTMLDivElement>(null);
  const lastSparkle = useRef({ x: 0, y: 0, t: 0 });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const spawnSparkle = (cx: number, cy: number) => {
      const layer = sparkleLayer.current;
      if (!layer || layer.childElementCount > 36) return;
      const size = 6 + Math.random() * 9;
      const color = SPARKLE_COLORS[(Math.random() * SPARKLE_COLORS.length) | 0];
      const star = document.createElement("span");
      star.className = "sparkle";
      star.style.left = `${cx + (Math.random() - 0.5) * 28}px`;
      star.style.top = `${cy + (Math.random() - 0.5) * 28}px`;
      star.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 10 10" fill="${color}" aria-hidden="true"><path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z"/></svg>`;
      layer.appendChild(star);
      setTimeout(() => star.remove(), 900);
    };

    const move = (e: MouseEvent) => {
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      setHovering(
        !!target?.closest("a, button, [role='button'], input, textarea, [data-cursor]")
      );

      // Sparkle when the pointer has travelled a little
      const now = performance.now();
      const { x: lx, y: ly, t } = lastSparkle.current;
      const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (dist > 26 && now - t > 40) {
        lastSparkle.current = { x: e.clientX, y: e.clientY, t: now };
        spawnSparkle(e.clientX, e.clientY);
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <>
      <div ref={sparkleLayer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[118]" />
      {enabled && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 rounded-full bg-accent"
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[120] rounded-full border border-accent/50"
            style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
            animate={{
              width: hovering ? 52 : 32,
              height: hovering ? 52 : 32,
              opacity: hovering ? 0.9 : 0.5,
              backgroundColor: hovering ? "rgba(255,196,107,0.08)" : "rgba(255,196,107,0)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          />
        </>
      )}
    </>
  );
}
