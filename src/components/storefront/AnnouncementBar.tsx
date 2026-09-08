import { getAnnouncements } from "@/data/content";
import { AnnouncementCarousel } from "./AnnouncementCarousel";

export async function AnnouncementBar() {
  const { messages } = await getAnnouncements();
  return <AnnouncementCarousel messages={messages} />;
}
