"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { profile } from "@/lib/data";
import { EASE_OUT_EXPO } from "@/lib/motion";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#projects", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#chat", label: "Chat" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = ["#top", ...LINKS.map((l) => l.href)]
      .map((href) => document.querySelector(href))
      .filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "top" ? "" : `#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent via-accent to-accent-2"
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#top" aria-label="Back to top" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="font-display text-sm font-bold tracking-wide">{profile.name}</span>
        </a>

        {/* Desktop glass pill */}
        <nav aria-label="Primary" className="glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                active === link.href ? "text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {active === link.href && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-accent"
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-accent hover:text-accent md:block"
        >
          Let&rsquo;s talk
        </a>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] flex flex-col bg-background/80 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-display text-sm font-bold">{profile.name}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="glass flex h-11 w-11 items-center justify-center rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-8">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="font-display border-b border-line py-4 text-4xl font-bold tracking-tight text-foreground/90 transition-colors hover:text-accent"
                >
                  <span className="mr-4 font-mono text-xs text-accent">0{i + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <p className="px-8 pb-10 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {profile.location}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
