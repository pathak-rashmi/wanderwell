export type DestinationSearchResult = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  displayName: string;
};

export async function searchDestinations(query: string): Promise<DestinationSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      results?: Array<{
        id: number;
        name: string;
        country?: string;
        latitude: number;
        longitude: number;
        admin1?: string;
      }>;
    };

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item) => {
      const city = item.name;
      const country = item.country || item.admin1 || "Unknown";
      return {
        id: `${item.id}-${item.latitude}-${item.longitude}`,
        city,
        country,
        latitude: item.latitude,
        longitude: item.longitude,
        displayName: `${city}, ${country}`,
      };
    });
  } catch (error) {
    console.error("Destination search error:", error);
    throw error;
  }
}
