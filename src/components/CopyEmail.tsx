"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export function CopyEmail({
  email,
  className,
  children,
}: {
  email: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — mailto link still fires via href
    }
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={`relative ${className ?? ""}`}
    >
      {children}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
          >
            <Check size={12} />
            Email copied
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}
