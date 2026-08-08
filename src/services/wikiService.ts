export type WikiSummary = {
  title: string;
  extract: string;
  thumbnailUrl?: string;
  description?: string;
  contentUrl?: string;
};

export async function fetchWikiSummary(destinationName: string): Promise<WikiSummary | null> {
  const trimmed = destinationName.trim();
  if (!trimmed) return null;

  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(trimmed)}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      return null;
    }

    return {
      title: data.title || trimmed,
      extract: data.extract || "",
      thumbnailUrl: data.thumbnail?.source,
      description: data.description,
      contentUrl: data.content_urls?.desktop?.page,
    };
  } catch (err) {
    console.error("Wiki summary fetch error:", err);
    return null;
  }
}
