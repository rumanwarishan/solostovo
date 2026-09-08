import { getHeroContent } from "@/data/content";
import { HeroSlider } from "./HeroSlider";

export async function Hero() {
  const { slides } = await getHeroContent();
  return <HeroSlider slides={slides} />;
}
