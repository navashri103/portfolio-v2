export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
        className="animate-[logoPulse_3.2s_ease-in-out_infinite]"
      >
        <defs>
          <linearGradient id="logoRing" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="55%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent-3)" />
          </linearGradient>
          <linearGradient id="logoLetter" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="#fff3dd" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <filter id="logoGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#logoRing)"
          strokeWidth="1"
          opacity="0.35"
        />

        <polygon
          points="50,6 85,27 85,73 50,94 15,73 15,27"
          stroke="url(#logoRing)"
          strokeWidth="3.5"
          filter="url(#logoGlow)"
        />

        <line x1="2" y1="50" x2="15" y2="50" stroke="url(#logoRing)" strokeWidth="2" />
        <line x1="85" y1="50" x2="98" y2="50" stroke="url(#logoRing)" strokeWidth="2" />
        <circle cx="50" cy="6" r="2.6" fill="var(--accent-2)" />
        <circle cx="50" cy="94" r="2.6" fill="var(--accent-2)" />
        <circle cx="15" cy="27" r="2.2" fill="var(--accent)" />
        <circle cx="85" cy="73" r="2.2" fill="var(--accent)" />
        <circle cx="2" cy="50" r="2.2" fill="var(--accent)" />
        <circle cx="98" cy="50" r="2.2" fill="var(--accent)" />

        <rect
          x="32"
          y="24"
          width="36"
          height="52"
          rx="6"
          fill="var(--accent)"
          opacity="0.18"
        />
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontFamily="var(--font-display), sans-serif"
          fontWeight="700"
          fontSize="44"
          fill="url(#logoLetter)"
          filter="url(#logoGlow)"
        >
          N
        </text>
      </svg>
    </span>
  );
}
