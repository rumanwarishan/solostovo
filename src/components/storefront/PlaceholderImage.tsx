/**
 * Stand-in for real product photography. Renders a labeled gradient tile
 * instead of a broken <img> so the layout reads correctly before you drop
 * in real photos — swap this component's usage for <Image> once you have
 * assets.
 */
export function PlaceholderImage({
  tone = "from-[#3a4a3f] to-[#1f2b23]",
  label,
  className = "",
}: {
  tone?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${tone} ${className}`}
      role="img"
      aria-label={`${label} product photo placeholder`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
      <span className="relative px-3 text-center font-display text-sm uppercase tracking-wide text-white/70">
        {label}
      </span>
    </div>
  );
}
