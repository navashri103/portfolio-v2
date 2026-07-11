# Nova Signal — Design System (Master)

Global source of truth for the Navashri portfolio. Page-specific overrides live in
`design-system/pages/` and take precedence when present.

**Concept:** *Starlight* — deep space in warm candlelight. A warm-black void, a
field of drifting twinkle stars, and nebula glows in stardust gold and ember.
Glassmorphism carries the surfaces; everything light floats in antigravity.
Strictly **no blue, purple, or green** — space rendered only in black, silver,
gold, and ember. Typography: Syne for display, Geist for body, mono for signals.

---

## 1. Color Tokens

| Token          | Value                     | Usage |
|----------------|---------------------------|-------|
| `--background` | `#080606`                 | Warm-black space void |
| `--surface`    | `#120E0C`                 | Cards, chat, panels |
| `--surface-2`  | `#1C1512`                 | Elevated / hover surfaces |
| `--foreground` | `#F7F2EA`                 | Primary text (starlight) |
| `--muted`      | `#A89C8D`                 | Secondary text (≥4.5:1 on void) |
| `--accent`     | `#FFC46B` (stardust gold) | CTAs, highlights, active states |
| `--accent-2`   | `#E8DDCC` (moon silver)   | Secondary accents, tags, frames |
| `--accent-3`   | `#FF8A5C` (ember)         | Warm highlights, status notes |
| `--line`       | `rgba(247,242,234,0.10)`  | Hairline borders |

Rules: text on gold = `#1C1205` (dark, ≥12:1). Never convey status by color alone —
pair with a label. Dark mode only (single-theme product, `color-scheme: dark`).
Signature effects: fixed twinkle starfield canvas, sparkle-star cursor trail,
glass panels (`.glass`, `.glass-deep`), and card constellations that drift with
the pointer via `--dx/--dy`.

## 2. Typography

- **Display:** Syne 600/700/800 — headlines, wordmark. Tracking −0.02em, leading 0.95.
- **Body:** Geist Sans 400/500 — 16–18px, leading 1.6, measure ≤ 65ch.
- **Signal:** Geist Mono 400/500 — uppercase 11–12px labels, tracking +0.3em, section indices, stats.

Scale: 12 label · 14 small · 16/18 body · 22 sub · 32 h3 · clamp(2.5rem→4rem) h2 ·
clamp(3.5rem→8.5rem) hero. Giant outlined index numerals (text-stroke) mark each section.

## 3. Space, Radius, Depth

- Spacing: 4px base — 4/8/12/16/24/32/48/64/96/144. Sections `py-28 → py-40`.
- Radius: `sm 10px · md 16px · lg 24px · pill 999px`.
- Borders over shadows: hairline `--line`; glow shadows only on accent hover
  (`0 0 40px rgba(203,255,77,.15)`).
- Glass: `rgba(255,255,255,.04)` + `backdrop-blur 16–24px` + hairline border.
  Blur communicates layering (nav, mobile menu, floating shards) — not decoration.

## 4. Motion

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 180ms | Micro (hover, press) |
| `--dur-base` | 300ms | State changes |
| `--dur-slow` | 700ms | Section reveals |
| ease-out-expo | `cubic-bezier(0.16,1,0.3,1)` | Entrances |
| springs | stiffness 150–300, damping 15–30 | Magnetic, tilt, cursor |

Choreography: word-mask reveals for headlines; 60–90ms stagger for groups; scroll-scrubbed
timeline (GSAP ScrollTrigger + Lenis); parallax ≤ 40px; exits ~65% of enter duration.
Only `transform`/`opacity` animate. Everything respects `prefers-reduced-motion`
(Lenis, particles, marquee, parallax all disable; content stays fully readable).

## 5. Components

- **Buttons:** pill; primary = lime fill + void text, magnetic + scale 0.97 press;
  secondary = hairline ghost, border → lime on hover. Min target 44px.
- **Cards:** surface + hairline; spotlight radial follows pointer; 3D tilt ≤ 6°.
- **Nav:** fixed glass pill, active-section indicator (layoutId), scroll progress hairline.
- **Icons:** Lucide, 1.5–2px stroke, one style level. Never emoji.

## 6. Layout

Max width 72rem (6xl). Every section uses a different composition: hero (centered, layered),
about (asymmetric editorial split + sticky portrait), journey (spine timeline), projects
(featured + broken grid), skills (bento), chat (centered console), contact (giant type CTA).
Breakpoints: 375 / 768 / 1024 / 1440. Mobile-first; no horizontal scroll.

## 7. Accessibility

WCAG AA. Skip link, semantic landmarks, `focus-visible` lime ring (2px, offset 3px),
aria-labels on icon-only controls, keyboard-operable menu (Esc closes), heading order
h1→h2→h3, reduced-motion supported globally.

## 8. Anti-patterns (avoid)

Corporate/SaaS template layouts · repeated section layouts · boring linear gradients ·
emoji icons · animating layout properties · motion without purpose · >500ms micro-interactions.
