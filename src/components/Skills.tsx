"use client";

import { motion } from "framer-motion";
import { Code2, Database, GitBranch, Layers, Server, Sparkles } from "lucide-react";
import { skillGroups, languages } from "@/lib/data";
import { handleSpotlight } from "@/lib/spotlight";
import { fadeUp, stagger } from "@/lib/motion";
import SectionHeading from "@/components/SectionHeading";

const CATEGORY_META: Record<string, { icon: typeof Code2; span: string }> = {
  Frontend: { icon: Code2, span: "lg:col-span-4" },
  Backend: { icon: Server, span: "lg:col-span-2" },
  Database: { icon: Database, span: "lg:col-span-2" },
  Tooling: { icon: GitBranch, span: "lg:col-span-2" },
  "Core CS": { icon: Layers, span: "lg:col-span-2" },
  "Beyond Code": { icon: Sparkles, span: "lg:col-span-2" },
};

/** Bento grid — spans vary per category so the composition breathes. */
export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-surface/40 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-20">
          <SectionHeading
            index="04"
            eyebrow="04 · Skills"
            title="The toolkit"
            lede="Interface to infrastructure — the stack I reach for when an idea needs to become a product."
          />
        </div>

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6"
        >
          {skillGroups.map((group) => {
            const meta = CATEGORY_META[group.category] ?? { icon: Code2, span: "lg:col-span-2" };
            const Icon = meta.icon;
            return (
              <motion.div
                key={group.category}
                variants={fadeUp}
                onMouseMove={handleSpotlight}
                className={`spotlight-card group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 ${meta.span}`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-accent transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Languages strip spans the full bento width */}
          <motion.div
            variants={fadeUp}
            onMouseMove={handleSpotlight}
            className="spotlight-card rounded-2xl border border-line bg-surface p-6 sm:col-span-2 lg:col-span-6"
          >
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Human languages
            </h3>
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-baseline gap-2.5">
                  <span className="font-display text-sm font-bold text-foreground">{lang.name}</span>
                  <span className="font-mono text-[11px] text-muted">{lang.level}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
