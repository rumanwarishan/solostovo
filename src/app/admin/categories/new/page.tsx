import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/admin/categories" className="text-xs text-brand-ink/50 hover:text-brand-primary">
        ← Back to categories
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold">Add category</h1>
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}
