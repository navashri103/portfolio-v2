"use client";

import { motion } from "framer-motion";
import { maskWord, stagger } from "@/lib/motion";

/**
 * Headline choreography: each word rises out of an overflow mask
 * with a slight rotation, staggered left to right.
 */
export default function WordReveal({
  text,
  className,
  wordClassName,
  as: Tag = "span",
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  /** Applied to each word — needed for background-clip effects like .gradient-text */
  wordClassName?: string;
  as?: "h1" | "h2" | "p" | "span";
  delay?: number;
  once?: boolean;
}) {
  const MotionTag = motion[Tag];
  const words = text.split(" ");

  return (
    <MotionTag
      variants={stagger(0.07, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.6 }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            variants={maskWord}
            className={`inline-block will-change-transform ${wordClassName ?? ""}`}
            aria-hidden="true"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
