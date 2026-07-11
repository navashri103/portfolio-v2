"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChefHat, Code2, Mail, Mountain } from "lucide-react";
import { profile } from "@/lib/data";
import Aurora from "@/components/Aurora";
import Magnetic from "@/components/anim/Magnetic";
import WordReveal from "@/components/anim/WordReveal";
import { EASE_OUT_EXPO } from "@/lib/motion";

const PERSONA_ICONS = [Mountain, Code2, ChefHat];

/** Shared antigravity drift — each element gets its own phase. */
const float = (amp: number, duration: number, delay = 0) => ({
  y: [0, -amp, 0],
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
});

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:px-8"
    >
      {/* Warm nebula behind the glass panel (global starfield sits underneath) */}
      <Aurora />

      {/* Content container without glass panel background */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        className="relative w-full max-w-3xl text-center"
      >
        {/* Eyebrow chip */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="glass mx-auto mb-10 inline-block rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent"
        >
          {"< Code. Design. Elevate. />"}
        </motion.p>

        {/* Antigravity headline */}
        <motion.div animate={reduced ? {} : float(12, 6, 0.5)}>
          <h1 className="font-display font-bold leading-tight tracking-tight">
            <WordReveal
              text={profile.displayName}
              className="block text-[20vw] sm:text-8xl md:text-9xl"
              delay={0.3}
            />
            <span className="mt-2 block">
              <WordReveal
                text={profile.role}
                wordClassName="text-accent"
                className="block text-[8vw] sm:text-5xl md:text-6xl font-semibold"
                delay={0.55}
              />
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-8 max-w-md text-lg text-muted text-balance sm:text-xl"
        >
          Building digital experiences that blend{" "}
          <span className="font-medium text-accent">logic</span> with{" "}
          <span className="font-medium text-accent-3">creativity</span>.
        </motion.p>

        {/* Tech stack row */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: EASE_OUT_EXPO }}
          className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {profile.heroStack.map((tech) => (
            <li
              key={tech}
              className="glass rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/85"
            >
              {tech}
            </li>
          ))}
        </motion.ul>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease: EASE_OUT_EXPO }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <motion.a
              href="#projects"
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-[#1c1205] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,196,107,0.35)]"
            >
              View work
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.a>
          </Magnetic>
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="glass group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <Mail size={15} />
              Email me
            </a>
          </Magnetic>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
        >
          {profile.subRole} · {profile.location}
        </motion.p>
      </motion.div>

      {/* Personas as a compact chip row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3, ease: EASE_OUT_EXPO }}
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
      >
        {profile.personas.map((persona, i) => {
          const Icon = PERSONA_ICONS[i % PERSONA_ICONS.length];
          return (
            <span
              key={persona.label}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/85"
            >
              <Icon size={13} className="text-accent" aria-hidden="true" />
              {persona.label}
            </span>
          );
        })}
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted transition-colors hover:text-foreground sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-line pt-1.5">
          <span className="scroll-wheel h-2 w-0.5 rounded-full bg-accent" />
        </span>
      </motion.a>
    </section>
  );
}
