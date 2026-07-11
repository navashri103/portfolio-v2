"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import WordReveal from "@/components/anim/WordReveal";

/**
 * Shared section opener: giant hollow index numeral, mono eyebrow,
 * word-masked display heading. Alignment varies per section so the
 * rhythm never repeats exactly.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  align = "left",
  lede,
}: {
  index: string;
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  lede?: string;
}) {
  const centered = align === "center";
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`relative ${centered ? "text-center" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`font-display text-outline pointer-events-none absolute -top-14 select-none text-[7rem] font-extrabold leading-none sm:-top-20 sm:text-[10rem] ${
          centered ? "left-1/2 -translate-x-1/2" : "-left-2"
        }`}
      >
        {index}
      </span>
      <motion.p
        variants={fadeUp}
        className="relative mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
      >
        {eyebrow}
      </motion.p>
      <WordReveal
        as="h2"
        text={title}
        className="relative font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
      />
      {lede && (
        <motion.p
          variants={fadeUp}
          className={`relative mt-5 max-w-xl text-base text-muted sm:text-lg ${centered ? "mx-auto" : ""}`}
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}
