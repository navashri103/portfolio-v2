"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, GitBranch } from "lucide-react";
import { projects } from "@/lib/data";
import { handleSpotlight } from "@/lib/spotlight";
import { EASE_OUT_EXPO, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/anim/TiltCard";

const statusStyles: Record<string, string> = {
  Live: "text-accent border-accent/40",
  "In Progress": "text-accent-2 border-accent-2/40",
  "Coming Soon": "text-accent-3/90 border-accent-3/30",
};

/** Cute four-point star used in card constellations. */
function Star({ size = 10, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z" />
    </svg>
  );
}

/**
 * Tiny constellation pinned inside each card. The stars ride the
 * --dx/--dy variables written by handleSpotlight, so they drift and
 * lean as the cursor moves across the card.
 */
function Constellation() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="parallax-star parallax-1 absolute right-[12%] top-[14%] text-accent/70 opacity-40 transition-opacity duration-300 group-hover:opacity-100">
        <Star size={14} />
      </span>
      <span className="parallax-star parallax-2 absolute right-[26%] top-[38%] text-accent-2/70 opacity-30 transition-opacity duration-300 group-hover:opacity-90">
        <Star size={8} />
      </span>
      <span className="parallax-star parallax-3 absolute bottom-[18%] right-[8%] text-accent-3/70 opacity-30 transition-opacity duration-300 group-hover:opacity-90">
        <Star size={11} />
      </span>
      <span className="parallax-star parallax-2 absolute bottom-[30%] left-[6%] text-foreground/50 opacity-25 transition-opacity duration-300 group-hover:opacity-80">
        <Star size={7} />
      </span>
    </div>
  );
}

/**
 * Featured project gets a full-width cinematic glass card; the rest
 * sit in a broken two-column grid with alternating offsets. Every
 * card tilts in 3D and its constellation drifts with the cursor.
 */
export default function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="relative overflow-hidden py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="03" eyebrow="03 · Work" title="Selected projects" />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-sm text-sm text-muted"
          >
            Live demo and source links land here as each project ships publicly — check back soon.
          </motion.p>
        </div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mb-6"
        >
          <TiltCard max={3}>
            <article
              onMouseMove={handleSpotlight}
              className="spotlight-card glass group relative overflow-hidden rounded-3xl p-8 transition-colors duration-300 hover:border-accent/40 sm:p-12"
            >
              <Constellation />
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-[90px] transition-opacity duration-500 group-hover:opacity-100"
              />
              <span
                aria-hidden="true"
                className="font-display text-outline pointer-events-none absolute -bottom-8 right-4 select-none text-[8rem] font-extrabold leading-none sm:text-[11rem]"
              >
                01
              </span>
              <div className="relative max-w-2xl">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    Featured build
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${statusStyles[featured.status]}`}
                  >
                    {featured.status}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                  {featured.name}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                  {featured.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {featured.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-surface-2 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </TiltCard>
        </motion.div>

        {/* Broken grid */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {rest.map((project, i) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              className={i % 2 === 1 ? "md:translate-y-10" : ""}
            >
              <TiltCard max={5} className="h-full">
                <article
                  onMouseMove={handleSpotlight}
                  className="spotlight-card glass group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 transition-colors duration-300 hover:border-accent/40"
                >
                  <Constellation />
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="font-mono text-xs text-muted">0{i + 2}</span>
                      <span
                        className={`flex flex-none items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${statusStyles[project.status]}`}
                      >
                        {project.status === "Coming Soon" && <Clock size={10} aria-hidden="true" />}
                        {project.status}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold transition-colors duration-300 group-hover:text-accent">
                      {project.name}
                    </h3>
                    <p className="mb-6 mt-3 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted/70">
                      <GitBranch size={14} aria-hidden="true" className="opacity-60" />
                      <span>Link coming soon</span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
