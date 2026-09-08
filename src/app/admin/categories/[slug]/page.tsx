import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <div>
      <Link href="/admin/categories" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to categories
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{category.name}</h1>
        <Link href={`/shop/${category.slug}`} className="text-sm text-brand-ink/60 hover:text-brand-primary">
          View live page →
        </Link>
      </div>
      <div className="mt-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
