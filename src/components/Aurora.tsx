/**
 * Warm nebula: three blurred light masses (gold, ember, candlelight)
 * drifting on infinite GPU-only keyframes. Sized/blurred conservatively
 * so raster cost stays low. Reduced motion freezes them into a static
 * glow, which is intentional.
 */
export default function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <div className="aurora-a absolute -top-[15%] left-[10%] h-[40vh] w-[40vh] rounded-full bg-accent/10 blur-[80px]" />
      <div className="aurora-b absolute top-[12%] right-[-10%] h-[36vh] w-[36vh] rounded-full bg-accent-3/10 blur-[90px]" />
      <div className="aurora-c absolute bottom-[-18%] left-[32%] h-[36vh] w-[44vh] rounded-full bg-[#8a5a2b]/15 blur-[85px]" />
    </div>
  );
}
