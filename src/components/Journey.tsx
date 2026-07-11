"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { journey } from "@/lib/data";
import { handleSpotlight } from "@/lib/spotlight";
import { EASE_OUT_EXPO } from "@/lib/motion";
import SectionHeading from "@/components/SectionHeading";

const icons = {
  experience: Briefcase,
  education: GraduationCap,
  milestone: Sparkles,
};

/**
 * Interactive timeline: a lime spine that draws itself as you scroll
 * (GSAP ScrollTrigger scrub), with nodes lighting up as the fill
 * passes them.
 */
export default function Journey() {
  const spineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !spineRef.current || !wrapRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 65%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="journey" className="relative overflow-hidden bg-surface/40 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-20">
          <SectionHeading
            index="02"
            eyebrow="02 · Journey"
            title="The road so far"
            lede="From classrooms in Dharmapuri to production code in Chennai — every step compounding."
          />
        </div>

        <div ref={wrapRef} className="relative">
          {/* Static track + scroll-drawn spine */}
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-line sm:left-[23px]" />
          <div
            ref={spineRef}
            className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent-2 sm:left-[23px]"
            style={{ transform: reduced ? undefined : "scaleY(0)" }}
          />

          <div className="space-y-10">
            {journey.map((item, i) => {
              const Icon = icons[item.kind];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE_OUT_EXPO }}
                  className="relative flex gap-6 sm:gap-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                    className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-accent/30 bg-background shadow-[0_0_20px_rgba(255,196,107,0.12)] sm:h-12 sm:w-12"
                  >
                    <Icon size={18} className="text-accent" aria-hidden="true" />
                  </motion.div>

                  <div
                    onMouseMove={handleSpotlight}
                    className="spotlight-card group flex-1 rounded-2xl border border-line bg-surface px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold">{item.title}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                        {item.period}
                      </span>
                    </div>
                    <p className="mb-3 text-sm font-medium text-accent">{item.org}</p>
                    <p className="mb-4 text-sm leading-relaxed text-muted">{item.description}</p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-300 group-hover:border-accent-2/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
