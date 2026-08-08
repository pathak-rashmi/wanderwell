export type DailyForecast = {
  day: string;
  temp: number;
  tempMin: number;
  kind: "sun" | "cloud" | "rain" | "snow";
  condition: string;
};

export type WeatherData = {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  condition: string;
  kind: "sun" | "cloud" | "rain" | "snow";
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  forecast: DailyForecast[];
  latitude: number;
  longitude: number;
};

function mapWmoCode(code: number): { condition: string; kind: "sun" | "cloud" | "rain" | "snow" } {
  if (code === 0) return { condition: "Clear skies", kind: "sun" };
  if (code === 1 || code === 2) return { condition: "Partly cloudy", kind: "sun" };
  if (code === 3) return { condition: "Overcast", kind: "cloud" };
  if ([45, 48].includes(code)) return { condition: "Foggy", kind: "cloud" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { condition: "Rain showers", kind: "rain" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: "Snowfall", kind: "snow" };
  }
  if ([95, 96, 99].includes(code)) {
    return { condition: "Thunderstorm", kind: "rain" };
  }
  return { condition: "Mild", kind: "sun" };
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export async function fetchWeather(
  cityName: string,
  latitude?: number,
  longitude?: number,
  countryName?: string,
): Promise<WeatherData> {
  let lat = latitude;
  let lng = longitude;
  let city = cityName;
  let country = countryName || "";

  // If coordinates not provided, search geocoding first
  if (lat === undefined || lng === undefined) {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
    );
    if (!geoRes.ok) {
      throw new Error("Unable to locate destination");
    }
    const geoData = (await geoRes.json()) as {
      results?: Array<{ name: string; country?: string; latitude: number; longitude: number }>;
    };
    const result = geoData.results?.[0];
    if (!result) {
      throw new Error(`Location "${cityName}" not found`);
    }
    lat = result.latitude;
    lng = result.longitude;
    city = result.name;
    country = result.country || country;
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) {
    throw new Error("Weather service unavailable");
  }

  const data = (await weatherRes.json()) as {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      weather_code: number;
      wind_speed_10m: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      sunrise?: string[];
      sunset?: string[];
    };
  };

  const mapped = mapWmoCode(data.current.weather_code);

  const forecast: DailyForecast[] = (data.daily.time || []).slice(0, 7).map((timeStr, idx) => {
    const code = data.daily.weather_code[idx] ?? 0;
    const mappedDaily = mapWmoCode(code);
    return {
      day: getDayName(timeStr),
      temp: Math.round(data.daily.temperature_2m_max[idx] ?? data.current.temperature_2m),
      tempMin: Math.round(data.daily.temperature_2m_min[idx] ?? data.current.temperature_2m),
      kind: mappedDaily.kind,
      condition: mappedDaily.condition,
    };
  });

  const formatTime = (iso?: string) => {
    if (!iso) return "06:30";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      return "06:30";
    }
  };

  return {
    city,
    country,
    temp: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: mapped.condition,
    kind: mapped.kind,
    humidity: Math.round(data.current.relative_humidity_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    sunrise: formatTime(data.daily.sunrise?.[0]),
    sunset: formatTime(data.daily.sunset?.[0]),
    forecast,
    latitude: lat,
    longitude: lng,
  };
}
