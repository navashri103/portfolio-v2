"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  IDLE,
  BLINK,
  WALK_A,
  WALK_B,
  CHAR_W,
  CHAR_H,
  ITEM_CUP,
  ITEM_STAR,
  ITEM_BUG,
  ITEM_HEART,
  drawSprite,
} from "@/lib/pixelSprite";

const W = 520;
const H = 340;
const GROUND = H - 18;
const PLAYER_SCALE = 2;
const PW = CHAR_W * PLAYER_SCALE;
const PH = CHAR_H * PLAYER_SCALE;
const BEST_KEY = "coffee-catch-best";
// ctx.font can't resolve CSS variables, so name the family directly.
const MONO = `"Geist Mono", Consolas, monospace`;

type ItemKind = "cup" | "star" | "bug";
type Item = { kind: ItemKind; x: number; y: number; vy: number; w: number; h: number };
type Toast = { x: number; y: number; text: string; color: string; until: number };

/**
 * Coffee Catch — a pocket-sized canvas game starring pixel Navashri.
 * Move with arrow keys / A-D or by dragging; catch coffee and stars,
 * dodge the bugs. Three lives, best score kept in localStorage.
 */
export default function CoffeeCatch({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without letting a parent re-render restart the game.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    panelRef.current?.focus();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Static backdrop stars, seeded once.
    const stars = Array.from({ length: 26 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (H - 90),
      r: Math.random() * 1.4 + 0.4,
      a: Math.random() * 0.25 + 0.08,
    }));

    const g = {
      phase: "ready" as "ready" | "playing" | "over",
      px: W / 2 - PW / 2,
      vx: 0,
      pointerX: null as number | null,
      facing: 1,
      items: [] as Item[],
      toasts: [] as Toast[],
      score: 0,
      best: Number(localStorage.getItem(BEST_KEY) || 0),
      lives: 3,
      hurtUntil: 0,
      lastSpawn: 0,
      keys: new Set<string>(),
      newBest: false,
    };

    const reset = () => {
      g.px = W / 2 - PW / 2;
      g.vx = 0;
      g.items = [];
      g.toasts = [];
      g.score = 0;
      g.lives = 3;
      g.hurtUntil = 0;
      g.lastSpawn = 0;
      g.newBest = false;
      g.phase = "playing";
    };

    const start = () => {
      if (g.phase !== "playing") reset();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (["ArrowLeft", "ArrowRight", " ", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
      if (g.phase !== "playing" && (e.key === "Enter" || e.key === " ")) start();
      if (g.phase !== "playing" && (e.key.startsWith("Arrow") || /^[ad]$/i.test(e.key))) start();
      g.keys.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => g.keys.delete(e.key.toLowerCase());

    const toLocalX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * W;
    };
    const onPointerMove = (e: PointerEvent) => {
      g.pointerX = toLocalX(e.clientX);
    };
    const onPointerDown = (e: PointerEvent) => {
      g.pointerX = toLocalX(e.clientX);
      start();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    const spawn = (t: number) => {
      const every = Math.max(400, 820 - g.score * 3);
      if (t - g.lastSpawn < every) return;
      g.lastSpawn = t;
      const roll = Math.random();
      const kind: ItemKind = roll < 0.55 ? "cup" : roll < 0.72 ? "star" : "bug";
      const size = kind === "star" ? 27 : 30;
      g.items.push({
        kind,
        x: 10 + Math.random() * (W - size - 20),
        y: -34,
        vy: (115 + Math.random() * 55 + Math.min(g.score * 1.1, 200)) / 1000,
        w: size,
        h: kind === "bug" ? 18 : 21,
      });
    };

    const centeredText = (
      text: string,
      y: number,
      size: number,
      color: string,
      weight = 700
    ) => {
      ctx.font = `${weight} ${size}px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillStyle = color;
      ctx.fillText(text, W / 2, y);
    };

    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      // Background tabs throttle rAF; freeze the sim instead of drip-spawning.
      if (document.hidden) {
        last = t;
        g.lastSpawn = t;
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(t - last, 40);
      last = t;

      // ── update ─────────────────────────────────────────────
      if (g.phase === "playing") {
        const left = g.keys.has("arrowleft") || g.keys.has("a");
        const right = g.keys.has("arrowright") || g.keys.has("d");
        if (left || right) {
          g.pointerX = null;
          g.vx = (right ? 1 : 0) - (left ? 1 : 0);
          g.px += g.vx * 0.27 * dt;
        } else if (g.pointerX !== null) {
          const target = g.pointerX - PW / 2;
          const d = target - g.px;
          g.px += Math.abs(d) < 2 ? d : d * 0.014 * dt;
          g.vx = Math.abs(d) > 4 ? Math.sign(d) : 0;
        } else {
          g.vx = 0;
        }
        g.px = Math.max(2, Math.min(W - PW - 2, g.px));
        if (g.vx !== 0) g.facing = g.vx;

        spawn(t);
        for (const item of g.items) item.y += item.vy * dt;

        // catches & hits — the torso row is the catch zone
        const pTop = GROUND - PH + 14;
        const kept: Item[] = [];
        for (const item of g.items) {
          const overlaps =
            item.y + item.h >= pTop &&
            item.y < GROUND &&
            item.x + item.w > g.px + 4 &&
            item.x < g.px + PW - 4;
          if (overlaps) {
            if (item.kind === "bug") {
              if (t > g.hurtUntil) {
                g.lives -= 1;
                g.hurtUntil = t + 900;
                g.toasts.push({ x: item.x, y: item.y, text: "ouch!", color: "#ff8a5c", until: t + 700 });
                if (g.lives <= 0) {
                  g.phase = "over";
                  if (g.score > g.best) {
                    g.best = g.score;
                    g.newBest = true;
                    localStorage.setItem(BEST_KEY, String(g.best));
                  }
                }
              }
            } else {
              const pts = item.kind === "star" ? 25 : 10;
              g.score += pts;
              g.toasts.push({
                x: item.x,
                y: item.y,
                text: `+${pts}`,
                color: item.kind === "star" ? "#ffc46b" : "#f7f2ea",
                until: t + 700,
              });
            }
            continue;
          }
          if (item.y < H + 40) kept.push(item);
        }
        g.items = kept;
        g.toasts = g.toasts.filter((toast) => toast.until > t);
      }

      // ── draw ───────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#ffc46b";
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      ctx.globalAlpha = 1;

      // ground
      ctx.fillStyle = "rgba(247, 242, 234, 0.12)";
      ctx.fillRect(0, GROUND + 2, W, 2);

      // items
      for (const item of g.items) {
        const sprite = item.kind === "cup" ? ITEM_CUP : item.kind === "star" ? ITEM_STAR : ITEM_BUG;
        drawSprite(ctx, sprite, item.x, item.y, 3);
      }

      // player (blinks while hurt)
      const hurt = t < g.hurtUntil && Math.floor(t / 90) % 2 === 0;
      if (!hurt) {
        const moving = g.phase === "playing" && g.vx !== 0;
        const frame = moving ? (Math.floor(t / 110) % 2 ? WALK_A : WALK_B) : g.phase === "over" ? BLINK : IDLE;
        drawSprite(ctx, frame, g.px, GROUND - PH + 2, PLAYER_SCALE);
      }

      // toasts
      ctx.font = `700 13px ${MONO}`;
      ctx.textAlign = "center";
      for (const toast of g.toasts) {
        const lift = (toast.until - t) / 700;
        ctx.globalAlpha = Math.max(0, lift);
        ctx.fillStyle = toast.color;
        ctx.fillText(toast.text, toast.x + 15, toast.y - (1 - lift) * 26);
      }
      ctx.globalAlpha = 1;

      // HUD
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = i < g.lives ? 1 : 0.18;
        drawSprite(ctx, ITEM_HEART, 12 + i * 20, 12, 2);
      }
      ctx.globalAlpha = 1;
      ctx.font = `700 16px ${MONO}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffc46b";
      ctx.fillText(String(g.score).padStart(4, "0"), W - 14, 26);

      if (g.phase === "ready") {
        ctx.fillStyle = "rgba(8, 6, 6, 0.55)";
        ctx.fillRect(0, 0, W, H);
        centeredText("COFFEE CATCH", H / 2 - 52, 26, "#ffc46b", 800);
        centeredText("catch ☕ +10 · ✦ +25 · dodge the bugs!", H / 2 - 18, 13, "#f7f2ea");
        centeredText("← → / A D or drag to move", H / 2 + 6, 13, "#a89c8d");
        if (Math.floor(t / 600) % 2) centeredText("press any key or tap to start", H / 2 + 44, 13, "#f7f2ea");
      } else if (g.phase === "over") {
        ctx.fillStyle = "rgba(8, 6, 6, 0.62)";
        ctx.fillRect(0, 0, W, H);
        centeredText("GAME OVER", H / 2 - 48, 26, "#ff8a5c", 800);
        centeredText(`score ${g.score}`, H / 2 - 12, 15, "#f7f2ea");
        centeredText(
          g.newBest ? "★ new best! ★" : `best ${g.best}`,
          H / 2 + 12,
          13,
          "#ffc46b"
        );
        if (Math.floor(t / 600) % 2) centeredText("enter / tap to play again", H / 2 + 48, 13, "#a89c8d");
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Coffee Catch mini-game"
    >
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass-deep relative w-full max-w-[560px] rounded-2xl p-4 outline-none sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold tracking-tight">
            Coffee <span className="gradient-text">Catch</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="rounded-full border border-line p-1.5 text-muted transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="mt-3 w-full rounded-xl border border-line bg-background/70 [image-rendering:pixelated]"
          style={{ aspectRatio: `${W} / ${H}`, touchAction: "none" }}
        />
        <p className="mt-3 text-center font-mono text-[11px] text-muted">
          fueling the portfolio, one ☕ at a time · esc to close
        </p>
      </div>
    </div>
  );
}
