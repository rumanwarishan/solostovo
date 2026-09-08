import { Hero } from "@/components/storefront/Hero";
import { CategoryTiles } from "@/components/storefront/CategoryTiles";
import { BestSellers } from "@/components/storefront/BestSellers";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { ReviewsTeaser } from "@/components/storefront/ReviewsTeaser";
import { CommunityTeaser } from "@/components/storefront/CommunityTeaser";

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
