"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tw: number; // twinkle phase
  hue: "gold" | "ember" | "white";
  shape: "dot" | "star";
};

/**
 * Deep-space starfield: drifting stars that twinkle and lean gently
 * away from the pointer. The larger ones are cute four-point sparkle
 * stars. DPR-aware, paused offscreen, skipped under reduced motion.
 */
export default function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let lastFrame = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    // Stars are tiny — DPR 1 keeps the repaint (and the backdrop blur
    // above it) cheap enough for 60fps composition.
    const dpr = 1;
    const FRAME_MS = 1000 / 30; // starfield drifts slowly; 30fps is plenty

    const colors = {
      gold: "255,196,107",
      ember: "255,138,92",
      white: "247,242,234",
    };

    // Cute four-point twinkle star
    const drawStar = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s);
      ctx.fill();
    };

    const seed = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(130, Math.floor((width * height) / 14000));
      particles = Array.from({ length: count }, () => {
        const r = Math.random() * 1.7 + 0.4;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r,
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.18 ? "gold" : Math.random() < 0.08 ? "ember" : "white",
          shape: r > 1.35 ? "star" : "dot",
        } as Particle;
      });
    };

    const tick = (t: number) => {
      if (!running) return;
      if (t - lastFrame < FRAME_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrame = t;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // gentle drift + pointer repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 14400) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        if (p.y > height + 8) p.y = -8;

        const twinkle = 0.3 + 0.4 * Math.sin(t * 0.0014 + p.tw);
        ctx.fillStyle = `rgba(${colors[p.hue]},${twinkle})`;
        if (p.shape === "star") {
          drawStar(p.x, p.y, p.r * 2.4);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    });
    observer.observe(canvas);

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseout", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", seed);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
