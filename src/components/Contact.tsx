"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { profile } from "@/lib/data";
import { LinkedinIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { CopyEmail } from "@/components/CopyEmail";
import Magnetic from "@/components/anim/Magnetic";
import WordReveal from "@/components/anim/WordReveal";
import Aurora from "@/components/Aurora";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/** Live Chennai clock — a small signal that there's a person here. */
function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs tabular-nums text-muted" suppressHydrationWarning>
      Chennai · {time} IST
    </span>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden pt-28 sm:pt-40">
      <Aurora className="opacity-70" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            06 · Contact
          </motion.p>

          <h2 className="font-display text-5xl font-extrabold tracking-tight text-balance sm:text-7xl">
            <WordReveal text="Let's build something" className="block" />
            <WordReveal text="worth shipping." wordClassName="gradient-text" className="block" delay={0.25} />
          </h2>

          <motion.p variants={fadeUp} className="mt-7 text-lg text-muted text-balance">
            Open to internships, collaborations, and opportunities to learn from real-world teams.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic strength={24}>
              <CopyEmail
                email={profile.email}
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-background transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(255,196,107,0.4)]"
              >
                <Mail size={16} aria-hidden="true" />
                {profile.email}
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </CopyEmail>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-4 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <LinkedinIcon size={15} />
                Connect on LinkedIn
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-9 inline-flex items-center gap-2 text-sm text-muted"
          >
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </motion.div>
        </motion.div>
      </div>

      <footer className="relative mt-28 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <p className="font-display text-sm font-bold">{profile.name}</p>
          </div>
          <LocalTime />
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} — Designed & built with Next.js
          </p>
        </div>
      </footer>
    </section>
  );
}
