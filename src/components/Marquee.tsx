"use client";

import { skillGroups } from "@/lib/data";

const ITEMS = [
  ...new Set(skillGroups.flatMap((g) => g.skills)),
].slice(0, 16);

/** Infinite mono ticker separating hero from the story sections. */
export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div aria-hidden="true" className="marquee-mask relative overflow-hidden border-y border-line py-5">
      <div className="animate-marquee flex w-max items-center gap-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {item}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-accent" fill="currentColor">
              <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
