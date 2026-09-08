import { notFound } from "next/navigation";
import { getProduct, compareGroup } from "@/data/products";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import { AddToCartBox } from "@/components/storefront/AddToCartBox";
import { CompareTable } from "@/components/storefront/CompareTable";
import { CrossSell } from "@/components/storefront/CrossSell";
import { FaqAccordion } from "@/components/storefront/FaqAccordion";
import { ReviewsTeaser } from "@/components/storefront/ReviewsTeaser";

// Product data can change from the admin at any time (price, stock,
// description), so this page is rendered per-request rather than
// pre-built at deploy time.
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const siblings = await compareGroup(product);

  return (
    <div className="py-10">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:grid-cols-2">
        <div className="grid grid-cols-[64px_1fr] gap-3">
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <PlaceholderImage
                key={i}
                tone={product.imageTone}
                label={`${i + 1}`}
                className="aspect-square w-16"
              />
            ))}
          </div>
          <PlaceholderImage tone={product.imageTone} label={product.name} className="aspect-square w-full" />
        </div>

        <AddToCartBox product={product} />
      </div>

      <section className="mx-auto mt-16 grid max-w-[1280px] gap-10 border-t border-brand-line px-4 pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold">About the {product.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink/80">{product.description}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">Specs</h2>
          <dl className="mt-3 divide-y divide-brand-line text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <dt className="text-brand-ink/60">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4">
        {siblings.length > 0 && (
          <section className="mt-16 border-t border-brand-line pt-10">
            <h2 className="font-display text-xl font-bold">How this compares</h2>
            <p className="mt-1 text-sm text-brand-ink/60">
              Not sure {product.name} is the right size? Here&apos;s how it stacks up.
            </p>
            <CompareTable products={[product, ...siblings]} />
          </section>
        )}

        {product.crossSell && <CrossSell ids={product.crossSell} />}

        <FaqAccordion />
      </div>

      <ReviewsTeaser />
    </div>
  );
}
