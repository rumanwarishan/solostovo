/**
 * Flame-in-a-frame preloader: a rounded square outline with a bright dash
 * that continuously travels around its perimeter, and a flame centered
 * inside. Pure CSS/SVG — no JS needed, safe to render on the server.
 */
export function Preloader({ size = 96, label = "Loading…" }: { size?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        {/* faint static track */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-brand-line"
        />
        {/* bright dash that loops around the perimeter */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="16"
          fill="none"
          stroke="#FF5A36"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="18 82"
          className="preloader-trace"
        />
        {/* flame */}
        <path
          d="M50 21c4.8 6.7 12 12.6 12 22.4C62 52.5 56.8 60 50 60s-12-7.5-12-16.6c0-2.9.8-5.3 1.8-7.4.7 3.6 2.6 6.2 4.6 6.2 2.3 0 3-3.4 1.9-7-1.3-4.3-1.5-8.9 3.7-14.2z"
          fill="#FF5A36"
          className="preloader-flame"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
