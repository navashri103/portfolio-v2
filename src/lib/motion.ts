import type { Variants } from "framer-motion";

/** Shared motion grammar — one rhythm across the whole site. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 16 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay, delayChildren },
  },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

/** Word-mask reveal, used with overflow-hidden parents. */
export const maskWord: Variants = {
  hidden: { y: "110%", rotate: 4 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
