"use client";

import React, { useState, useEffect, useRef } from 'react';
import { projects } from '@/lib/data';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const statusStyles: Record<string, string> = {
  Live: "border-accent text-accent",
  "In Progress": "border-accent-2 text-accent-2",
  "Coming Soon": "border-accent-3/50 text-accent-3/80",
};

export default function ProjectsCarousel() {
  const cardCount = projects.length;
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameId = useRef<number>(0);

  // Continuous scroll progress
  const progress = useRef<number>(0);

  // Track mouse coordinates for interactive 3D parallax tilt with inertia damping
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Responsive state containing card dimensions
  const [metrics, setMetrics] = useState({
    cardW: 336,
    cardH: 280,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Calculate Card Metrics
      let cardW = Math.round(w * 0.16 + 130);

      const heightFactor = Math.min(1.0, Math.max(0.65, h / 850));
      cardW = Math.round(cardW * heightFactor);

      cardW = Math.min(380, Math.max(160, cardW));
      const cardH = Math.round(cardW * 0.85);

      setMetrics({ cardW, cardH });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute positions, rotations, and visual rules at 60fps
  const renderLoop = () => {
    // Slower rotation for premium feel
    progress.current += 0.0014;

    // Smoothly interpolate current mouse variables towards their target positions
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

    const cards = cardsRefs.current;
    const h = window.innerHeight;
    const { cardH } = metrics;

    const continuousProgress = progress.current;
    const roundedIndex = Math.round(continuousProgress);
    const diffFromRound = continuousProgress - roundedIndex;

    // Custom non-linear magnetic step logic
    const easedDiff = Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2) / 2;
    const virtualActiveIndex = roundedIndex + easedDiff;

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      if (!card) continue;

      let offset = i - virtualActiveIndex;
      const halfCount = cardCount / 2;
      while (offset > halfCount) offset -= cardCount;
      while (offset < -halfCount) offset += cardCount;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset > 3.0) {
        card.style.visibility = 'hidden';
        continue;
      } else {
        card.style.visibility = 'visible';
      }

      const gap = 36;
      const peekAmount = -55;
      const D = 1350;

      let y = 0;
      let z = 0;
      let rot = 0;

      if (absOffset <= 1) {
        const t = absOffset;
        const easedT = t * t * (3 - 2 * t);

        const targetY = cardH + gap;
        y = -sign * (easedT * targetY);

        z = 400 + easedT * (220 - 400);

        rot = easedT * 132;
      } else if (absOffset <= 2) {
        const t = absOffset - 1;
        const easedT = t * t * (3 - 2 * t);

        const yStart = cardH + gap;
        const zStart = 220;
        const rotStart = 132;

        const zEnd = -60;
        const rotEnd = 175;

        const sEnd = D / (D - zEnd);
        const yEnd = (h / 2 - peekAmount) / sEnd - (cardH / 2);

        const currentY = yStart + easedT * (yEnd - yStart);
        y = -sign * currentY;

        z = zStart + easedT * (zEnd - zStart);
        rot = rotStart + easedT * (rotEnd - rotStart);
      } else {
        const t = Math.min(absOffset - 2, 1);
        const easedT = t * t * (3 - 2 * t);

        const zStart = -60;
        const rotStart = 175;

        const zEnd3 = -250;
        const rotEnd3 = 195;

        const sEnd2 = D / (D - zStart);
        const yEnd2 = (h / 2 - peekAmount) / sEnd2 - (cardH / 2);

        const sEnd3 = D / (D - zEnd3);
        const yEnd3 = (h / 2 + 100) / sEnd3 + (cardH / 2);

        const currentY = yEnd2 + easedT * (yEnd3 - yEnd2);
        y = -sign * currentY;

        z = zStart + easedT * (zEnd3 - zStart);
        rot = rotStart + easedT * (rotEnd3 - rotStart);
      }

      const localCardRotation = -sign * rot;

      const centerFactor = Math.max(0, 1 - absOffset);

      const maxTiltY = 15;
      const maxTiltX = 12;

      const activeTiltX = -mouse.current.y * maxTiltX * centerFactor;
      const activeTiltY = mouse.current.x * maxTiltY * centerFactor;

      const totalRotX = localCardRotation + activeTiltX;
      const totalRotY = activeTiltY;

      card.style.zIndex = Math.round(z).toString();
      card.style.opacity = '1';

      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(-3deg)`;
    }
  };

  useEffect(() => {
    const tick = () => {
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };

    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
  }, [metrics]);

  // Volumetric depth layers
  const thicknessLayers = [-1.47, -0.73, 0, 0.73, 1.47];

  const colors = [
    'from-accent via-accent-2 to-accent-3',
    'from-accent-2 via-accent to-accent-3',
    'from-accent-3 via-accent-2 to-accent',
    'from-accent via-accent-3 to-accent-2',
    'from-accent-2 via-accent-3 to-accent',
  ];

  return (
    <section id="projects" className="relative overflow-hidden py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-16 sm:mb-20">
          <SectionHeading index="03" eyebrow="03 · Work" title="Featured projects" />
          <p className="mt-6 max-w-lg text-sm text-muted">
            Scroll through my latest projects built with modern tech. Each card represents a unique challenge solved with clean code and creative problem-solving.
          </p>
        </div>

        {/* 3D perspective camera space */}
        <div
          className="relative w-full h-screen max-h-[600px] flex items-center justify-center pointer-events-none"
          style={{
            perspective: '1350px',
          }}
        >
          {/* Dynamic 3D coordinate viewport */}
          <div
            className="absolute"
            style={{
              width: `${metrics.cardW}px`,
              height: `${metrics.cardH}px`,
              transformStyle: 'preserve-3d',
            }}
          >
            {Array.from({ length: cardCount }).map((_, i) => (
              <div
                key={i}
                ref={(el) => { cardsRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  width: `${metrics.cardW}px`,
                  height: `${metrics.cardH}px`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible',
                }}
              >
                {/* Build physical 3D volumetric thickness */}
                {thicknessLayers.map((zOffset, layerIdx) => {
                  const isFrontFace = layerIdx === thicknessLayers.length - 1;
                  const isBackFace = layerIdx === 0;
                  const project = projects[i];

                  // Middle structural slice
                  if (!isFrontFace && !isBackFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="absolute inset-0 rounded-2xl border border-muted/30 pointer-events-none"
                        style={{
                          backgroundColor: '#1c1512',
                          transform: `translateZ(${zOffset}px)`,
                        }}
                      />
                    );
                  }

                  // Front face
                  if (isFrontFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="absolute inset-0 rounded-2xl border border-foreground/10 pointer-events-none overflow-hidden"
                        style={{
                          backgroundColor: '#120e0c',
                          transform: `translateZ(${zOffset}px)`,
                          backfaceVisibility: 'hidden',
                          boxShadow: 'inset 0 1px 1px rgba(247,242,234,0.1)',
                          background: `linear-gradient(135deg, rgba(255, 196, 107, 0.1) 0%, rgba(232, 221, 204, 0.05) 50%, rgba(255, 138, 92, 0.05) 100%), #120e0c`,
                        }}
                      >
                        <div className="absolute inset-0 p-5 sm:p-6 text-foreground h-full w-full font-sans z-10 flex flex-col justify-between">
                          {/* Header with status */}
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                                Project {i + 1}
                              </span>
                              <span
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${statusStyles[project.status]} flex-shrink-0`}
                              >
                                {project.status}
                              </span>
                            </div>

                            <h3 className="font-display text-lg sm:text-xl font-bold text-accent mb-2">
                              {project.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          {/* Footer with tech stack */}
                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {project.stack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-full bg-surface-2/60 text-foreground/70 font-mono text-[8px] uppercase tracking-[0.05em] border border-foreground/5"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.stack.length > 3 && (
                                <span className="px-2 py-0.5 text-foreground/60 font-mono text-[8px]">
                                  +{project.stack.length - 3}
                                </span>
                              )}
                            </div>

                            {/* View more link */}
                            <div className="flex items-center gap-1.5 text-xs text-muted/70 group">
                              <GitBranch size={12} className="opacity-60" />
                              <span className="group-hover:text-accent transition-colors">
                                {project.link ? 'View Project' : 'Coming Soon'}
                              </span>
                              <ArrowUpRight
                                size={12}
                                className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Back face
                  if (isBackFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="absolute inset-0 rounded-2xl border border-foreground/10 pointer-events-none overflow-hidden"
                        style={{
                          backgroundColor: '#120e0c',
                          transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                          backfaceVisibility: 'hidden',
                          boxShadow: 'inset 0 1px 1px rgba(247,242,234,0.1)',
                          background: `linear-gradient(135deg, rgba(255, 196, 107, 0.05) 0%, rgba(232, 221, 204, 0.08) 50%, rgba(255, 138, 92, 0.05) 100%), #120e0c`,
                        }}
                      >
                        <div className="absolute inset-0 p-5 sm:p-6 text-foreground/70">
                          {/* Magnetic stripe simulation */}
                          <div className="absolute left-0 right-0 top-4 h-6 sm:h-7 bg-black/60 backdrop-blur-md border-y border-black/80" />

                          {/* Back content */}
                          <div className="mt-14 space-y-4">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted/60 mb-1">
                                Full Stack
                              </p>
                              <p className="font-mono text-sm text-foreground/80">
                                End-to-end development
                              </p>
                            </div>

                            <div className="pt-4 border-t border-foreground/10">
                              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted/60 mb-2">
                                Status
                              </p>
                              <p className={`font-mono text-sm font-medium ${project.status === 'Live' ? 'text-accent' : project.status === 'In Progress' ? 'text-accent-2' : 'text-accent-3/80'}`}>
                                {project.status}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-foreground/10">
                              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted/60 mb-1">
                                Stack Size
                              </p>
                              <p className="font-mono text-sm text-foreground/80">
                                {project.stack.length} technologies
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel hint */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted/60 font-mono tracking-[0.1em]">
            ↑ Scroll or move your cursor to explore ↑
          </p>
        </div>
      </div>
    </section>
  );
}
