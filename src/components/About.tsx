"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/data";
import { handleSpotlight } from "@/lib/spotlight";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/anim/TiltCard";
import Counter from "@/components/anim/Counter";

const STATS = [
  { value: 9.6, decimals: 2, suffix: "", label: "CGPA at SRM IST" },
  { value: 6, decimals: 0, suffix: "+", label: "Projects in flight" },
  { value: 4, decimals: 0, suffix: "", label: "Languages spoken" },
  { value: 2028, decimals: 0, suffix: "", label: "Graduating class" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const frameY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Portrait column with counter-parallax frames */}
          <div className="relative lg:col-span-5">
            <SectionHeading index="01" eyebrow="01 · About" title="Who I am" />
            <div className="relative mt-12 max-w-xs">
              <motion.div
                aria-hidden="true"
                style={{ y: reduced ? 0 : frameY }}
                className="absolute -inset-4 rounded-[2rem] border border-accent-2/30"
              />
              <motion.div style={{ y: reduced ? 0 : portraitY }}>
                <TiltCard max={5}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-surface">
                    <Image
                      src="/images/profile.jpg"
                      alt={`Portrait of ${profile.name}`}
                      fill
                      sizes="(max-width: 1024px) 80vw, 320px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                      {profile.location}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
              <motion.span
                aria-hidden="true"
                animate={reduced ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass absolute -right-6 -top-6 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
              >
                Hello ✦
              </motion.span>
            </div>
          </div>

          {/* Story column */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-6 lg:col-span-7 lg:pt-24"
          >
            {profile.bio.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-lg leading-relaxed text-muted text-balance sm:text-xl"
              >
                {p}
              </motion.p>
            ))}

            <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              {profile.quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  onMouseMove={handleSpotlight}
                  className="spotlight-card rounded-2xl border border-line bg-surface px-5 py-4 transition-colors duration-300 hover:border-accent/30"
                >
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {fact.label}
                  </p>
                  <p className="text-sm font-medium text-foreground">{fact.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Animated statistics */}
            <motion.dl
              variants={fadeUp}
              className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-surface px-5 py-6 text-center">
                  <dd className="font-display text-3xl font-bold text-accent">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
