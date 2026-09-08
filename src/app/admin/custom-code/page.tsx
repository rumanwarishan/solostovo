import { getCustomCode } from "@/data/content";
import { CustomCodeForm } from "@/components/admin/CustomCodeForm";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCustomCodePage() {
  const customCode = await getCustomCode();
  const dbConfigured = isDbConfigured();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Custom code</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        Insert your own HTML, CSS, or JavaScript into the header, content, or footer area.
      </p>

      {!dbConfigured && (
        <p className="mt-3 rounded-sm border border-dashed border-brand-line bg-brand-surface p-3 text-xs text-brand-ink/60">
          Not connected to a database — saving requires a database (see README).
        </p>
      )}

      <div className="mt-6">
        <CustomCodeForm initial={customCode} />
      </div>
    </div>
  );
}
