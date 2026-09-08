const PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
];

/** Extracts the 11-character video ID from any common YouTube URL shape, or null if it isn't one. */
export function getYouTubeId(url: string): string | null {
  for (const pattern of PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Background-video embed URL: autoplay, muted (required by browsers for
 * autoplay), looping a single video (YouTube requires playlist=<id> for
 * that), and stripped of player chrome.
 */
export function getYouTubeBackgroundEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    showinfo: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    iv_load_policy: "3",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
