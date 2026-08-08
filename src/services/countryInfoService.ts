export type CountryInfo = {
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  languages: string[];
  currencies: { code: string; name: string; symbol: string }[];
  flagEmoji: string;
  flagUrl: string;
  population: number;
};

export type ExchangeRates = {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
};

export async function fetchCountryInfo(countryOrCityName: string): Promise<CountryInfo | null> {
  const trimmed = countryOrCityName.trim();
  if (!trimmed) return null;

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(trimmed)}?fullText=false`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const country = data[0];
    const languages = country.languages ? Object.values(country.languages) as string[] : [];
    
    const currenciesArr: { code: string; name: string; symbol: string }[] = [];
    if (country.currencies) {
      for (const [code, val] of Object.entries(country.currencies as Record<string, { name: string; symbol: string }>)) {
        currenciesArr.push({
          code,
          name: val.name || code,
          symbol: val.symbol || code,
        });
      }
    }

    return {
      name: country.name?.common || trimmed,
      officialName: country.name?.official || trimmed,
      capital: country.capital?.[0] || "N/A",
      region: country.region || "Global",
      subregion: country.subregion || "",
      languages: languages.slice(0, 4),
      currencies: currenciesArr,
      flagEmoji: country.flag || "🏳️",
      flagUrl: country.flags?.svg || country.flags?.png || "",
      population: country.population || 0,
    };
  } catch (err) {
    console.error("Error fetching country info:", err);
    return null;
  }
}

export async function fetchLiveExchangeRates(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return null;
    const data = await res.json();
    return {
      base: data.base_code || "USD",
      rates: data.rates || {},
      updatedAt: data.time_last_update_utc || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error fetching exchange rates:", err);
    return null;
  }
}
