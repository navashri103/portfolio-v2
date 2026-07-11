"use client";

import { useEffect, useRef, useState } from "react";
import {
  IDLE,
  BLINK,
  WALK_A,
  WALK_B,
  POINT,
  CHAR_W,
  CHAR_H,
  drawSprite,
} from "@/lib/pixelSprite";
import CoffeeCatch from "./CoffeeCatch";

const GREETING = "Hi! I'm pixel-Nava ☕ Click me for a game!";
const CLICK_HINT = "psst… click me — game time! 🎮";

const SECTION_LINES: Record<string, string> = {
  about: "That's me! Well… the high-res version.",
  journey: "My story so far — keep scrolling!",
  projects: "I built these. Powered by coffee ☕",
  skills: "My toolkit — always growing.",
  chat: "Ask the AI anything about me!",
  contact: "Say hi — I reply fast ✨",
};

/**
 * Pixel Navashri: walks along the bottom edge as a living scroll-progress
 * marker — scroll down and she strolls right, scroll up and she walks back.
 * She comments on whichever section you're looking at, and clicking her
 * opens the Coffee Catch mini-game.
 */
export default function PixelPal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleSide, setBubbleSide] = useState<"left" | "right">("left");
  const [gameOpen, setGameOpen] = useState(false);
  const [scale, setScale] = useState(3);

  // Mutable animation state, outside React renders.
  const anim = useRef({
    x: 24,
    targetX: 24,
    facing: 1,
    nextBlink: 0,
    blinkUntil: 0,
    pointUntil: 0,
    greeted: false,
    played: false,
    lastSpoke: 0,
    section: "",
  });

  // ── Walk + draw loop ─────────────────────────────────────────
  useEffect(() => {
    if (gameOpen) return;
    const canvas = canvasRef.current;
    const mover = moverRef.current;
    if (!canvas || !mover) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sc = scale;

    const fit = () => {
      sc = window.innerWidth < 640 ? 2 : 3;
      setScale(sc);
      canvas.width = CHAR_W * sc * dpr;
      canvas.height = CHAR_H * sc * dpr;
      canvas.style.width = `${CHAR_W * sc}px`;
      canvas.style.height = `${CHAR_H * sc}px`;
    };
    fit();

    const st = anim.current;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const pad = 14;
      st.targetX = pad + progress * (window.innerWidth - CHAR_W * sc - pad * 2);
      setVisible(window.scrollY > 240);
    };
    const onResize = () => {
      fit();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const tick = (t: number) => {
      st.x += (st.targetX - st.x) * (reduced ? 1 : 0.085);
      const moving = Math.abs(st.targetX - st.x) > 1.5;
      if (moving) st.facing = st.targetX > st.x ? 1 : -1;

      let frame = IDLE;
      if (moving && !reduced) {
        frame = Math.floor(t / 130) % 2 ? WALK_A : WALK_B;
      } else if (t < st.pointUntil) {
        frame = POINT;
      } else if (t < st.blinkUntil) {
        frame = BLINK;
      } else if (!reduced) {
        if (!st.nextBlink) st.nextBlink = t + 2200;
        if (t > st.nextBlink) {
          st.blinkUntil = t + 180;
          st.nextBlink = t + 2600 + Math.random() * 2400;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // No mirroring: she's front-facing, and flipping would swap the
      // coffee cup to the other hand mid-walk, which reads as it vanishing.
      drawSprite(ctx, frame, 0, 0, sc * dpr);
      mover.style.transform = `translateX(${st.x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOpen]);

  // ── Speech bubbles ───────────────────────────────────────────
  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    const speak = (line: string) => {
      // Anchor the bubble away from the nearest screen edge.
      setBubbleSide(anim.current.x < window.innerWidth / 2 ? "left" : "right");
      setBubble(line);
      anim.current.pointUntil = performance.now() + 1500;
      anim.current.lastSpoke = performance.now();
      clearTimeout(hide);
      hide = setTimeout(() => setBubble(null), 4200);
    };

    // Nudge mid-scroll readers until they've played once.
    const hint = setInterval(() => {
      const st = anim.current;
      if (visible && !st.played && performance.now() - st.lastSpoke > 6000) {
        speak(CLICK_HINT);
      }
    }, 11000);

    // Greet once, the first time she steps on stage.
    if (visible && !anim.current.greeted) {
      anim.current.greeted = true;
      speak(GREETING);
    }

    const sections = Object.keys(SECTION_LINES)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (id !== anim.current.section) {
            anim.current.section = id;
            if (visible) speak(SECTION_LINES[id]);
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    sections.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      clearTimeout(hide);
      clearInterval(hint);
    };
  }, [visible]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] transition-transform duration-700"
        style={{
          transform: visible && !gameOpen ? "translateY(0)" : "translateY(115%)",
          transitionTimingFunction: "var(--ease-out-expo)",
        }}
      >
        <div ref={moverRef} className="w-fit will-change-transform">
          <div className="relative flex flex-col items-center">
            {bubble && (
              <div
                aria-hidden="true"
                className={`glass absolute bottom-full mb-2 w-max max-w-[min(230px,80vw)] rounded-xl px-3 py-2 font-mono text-[11px] leading-snug text-foreground/90 ${
                  bubbleSide === "left" ? "left-0 rounded-bl-sm" : "right-0 rounded-br-sm"
                }`}
              >
                {bubble}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                anim.current.played = true;
                setGameOpen(true);
              }}
              aria-label="Play Coffee Catch — a pixel mini-game"
              title="Play Coffee Catch"
              className="pointer-events-auto relative block cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
            >
              <canvas
                ref={canvasRef}
                className="block [image-rendering:pixelated]"
                width={CHAR_W * scale}
                height={CHAR_H * scale}
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-1/2 -z-10 h-2 w-14 -translate-x-1/2 rounded-full bg-black/50 blur-[3px]"
              />
            </button>
          </div>
        </div>
      </div>
      {gameOpen && <CoffeeCatch onClose={() => setGameOpen(false)} />}
    </>
  );
}
