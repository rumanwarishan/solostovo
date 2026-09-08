export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-sm border border-brand-line bg-brand-surface p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-brand-ink/50">{label}</span>
      <div className="tabular mt-2 text-2xl font-bold">{value}</div>
      {sub && <span className="text-xs text-brand-ink/50">{sub}</span>}
    </div>
  );
}
