import { getHeroContent } from "@/data/content";
import { HeroSlider } from "./HeroSlider";

export async function Hero({ overlapHeader = true }: { overlapHeader?: boolean }) {
  const { slides } = await getHeroContent();
  return <HeroSlider slides={slides} overlapHeader={overlapHeader} />;
}
