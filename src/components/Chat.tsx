"use client";

import { motion } from "framer-motion";
import AICareerChat from "@/components/AICareerChat";
import SectionHeading from "@/components/SectionHeading";
import { EASE_OUT_EXPO } from "@/lib/motion";

export default function Chat() {
  return (
    <section id="chat" className="relative overflow-hidden py-28 sm:py-40">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-accent-2/10 blur-[100px]"
      />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-14">
          <SectionHeading
            index="05"
            eyebrow="05 · Digital twin"
            title="Ask me anything"
            align="center"
            lede="An AI version of me, trained on my own career, skills, and projects — ask it whatever you'd ask in an interview."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mx-auto max-w-2xl"
        >
          <AICareerChat />
        </motion.div>
      </div>
    </section>
  );
}
