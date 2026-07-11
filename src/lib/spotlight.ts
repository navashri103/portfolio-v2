import type { MouseEvent } from "react";

/**
 * Tracks the pointer inside a card. Sets:
 *  --mx/--my  → percentage position (spotlight gradients)
 *  --dx/--dy  → px offset from center (parallax layers, constellation stars)
 */
export function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty("--mx", `${x}%`);
  e.currentTarget.style.setProperty("--my", `${y}%`);
  e.currentTarget.style.setProperty("--dx", `${e.clientX - rect.left - rect.width / 2}px`);
  e.currentTarget.style.setProperty("--dy", `${e.clientY - rect.top - rect.height / 2}px`);
}
