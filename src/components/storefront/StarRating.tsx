export function StarRating({
  rating,
  reviewCount,
  size = "md",
  hideCount = false,
}: {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
  hideCount?: boolean;
}) {
  const starSize = size === "sm" ? 12 : 15;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <svg key={i} width={starSize} height={starSize} viewBox="0 0 20 20">
              <path
                d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5Z"
                fill={filled ? "var(--brand-accent)" : "var(--brand-line)"}
              />
            </svg>
          );
        })}
      </div>
      {!hideCount && (
        <span className="tabular text-xs text-brand-ink/60">
          {rating.toFixed(1)} ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
