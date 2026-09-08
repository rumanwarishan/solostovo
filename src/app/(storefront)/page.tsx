import { Hero } from "@/components/storefront/Hero";
import { CategoryTiles } from "@/components/storefront/CategoryTiles";
import { BestSellers } from "@/components/storefront/BestSellers";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { ReviewsTeaser } from "@/components/storefront/ReviewsTeaser";
import { CommunityTeaser } from "@/components/storefront/CommunityTeaser";

// Homepage content (hero slides, categories, best sellers) is DB-backed
// and editable from /admin, so it must reflect edits without a rebuild.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <BestSellers />
      <TrustStrip />
      <ReviewsTeaser />
      <CommunityTeaser />
    </>
  );
}
