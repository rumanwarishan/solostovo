import Link from "next/link";
import type { Product } from "@/data/products";

export function CompareTable({ products }: { products: Product[] }) {
  const specKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-brand-line py-3 text-left text-xs uppercase tracking-wide text-brand-ink/50">
              &nbsp;
            </th>
            {products.map((p) => (
              <th key={p.id} className="border-b border-brand-line py-3 text-left">
                <Link href={`/product/${p.slug}`} className="font-medium hover:text-brand-primary">
                  {p.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2.5 text-xs uppercase tracking-wide text-brand-ink/50">Price</td>
            {products.map((p) => (
              <td key={p.id} className="tabular border-b border-brand-line py-2.5 font-medium">
                ${p.price}
              </td>
            ))}
          </tr>
          {specKeys.map((key) => (
            <tr key={key}>
              <td className="py-2.5 text-xs uppercase tracking-wide text-brand-ink/50">{key}</td>
              {products.map((p) => (
                <td key={p.id} className="border-b border-brand-line py-2.5">
                  {p.specs[key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
