import { useEffect, useState } from "react";
import { Bus, Coins, Globe, Landmark, Lightbulb, Loader2, PartyPopper, Phone, UtensilsCrossed } from "lucide-react";
import { essentials } from "@/lib/travel-data";
import { Reveal, Section, SectionHeader } from "./Section";
import { useTrip } from "@/contexts/TripContext";
import { fetchCountryInfo, fetchLiveExchangeRates, type CountryInfo, type ExchangeRates } from "@/services/countryInfoService";

const iconMap: Record<string, typeof Bus> = {
  utensils: UtensilsCrossed,
  landmark: Landmark,
  party: PartyPopper,
  lightbulb: Lightbulb,
  phone: Phone,
  bus: Bus,
  coins: Coins,
};

export function Essentials() {
  const { selectedDestination, tripParams } = useTrip();
  const [countryData, setCountryData] = useState<CountryInfo | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(false);

  const countryQuery = selectedDestination.country || tripParams.destination;

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    Promise.all([
      fetchCountryInfo(countryQuery),
      fetchLiveExchangeRates(),
    ]).then(([countryRes, ratesRes]) => {
      if (!isCurrent) return;
      if (countryRes) setCountryData(countryRes);
      if (ratesRes) setExchangeRates(ratesRes);
    }).finally(() => {
      if (isCurrent) setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [countryQuery]);

  const currencyCode = countryData?.currencies[0]?.code || "EUR";
  const currencySymbol = countryData?.currencies[0]?.symbol || "€";
  const currencyName = countryData?.currencies[0]?.name || "Euro";

  const rateVal = exchangeRates?.rates[currencyCode];
  const rateText = rateVal ? `1 USD ≈ ${currencySymbol}${rateVal.toFixed(2)} ${currencyCode}` : `1 USD ≈ 0.92 EUR`;

  return (
    <Section id="essentials" className="gradient-aurora">
      <SectionHeader
        eyebrow="Local guide"
        title={`Travel Essentials for ${selectedDestination.name || tripParams.destination}`}
        description="Live country information, official currency rates, transport, and local highlights fetched from public APIs."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Real-time Country Info Card */}
        <Reveal delay={0}>
          <div className="card-lift h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="gradient-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground shadow-glow">
                <Globe className="h-5 w-5" aria-hidden />
              </span>
              {countryData?.flagEmoji ? (
                <span className="text-3xl" title={countryData.name}>{countryData.flagEmoji}</span>
              ) : null}
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold">
              {countryData ? `${countryData.name} Overview` : "Destination Details"}
            </h3>

            {loading ? (
              <div className="my-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Fetching country info...</span>
              </div>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <span className="font-medium text-foreground">Capital City:</span>
                  <span>{countryData?.capital || "Local Capital"}</span>
                </li>
                <li className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <span className="font-medium text-foreground">Languages:</span>
                  <span className="truncate max-w-[140px]">{countryData?.languages.join(", ") || "English, Local"}</span>
                </li>
                <li className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <span className="font-medium text-foreground">Region:</span>
                  <span>{countryData?.region} ({countryData?.subregion || "Global"})</span>
                </li>
              </ul>
            )}
          </div>
        </Reveal>

        {/* Live Currency & Exchange Rates Card */}
        <Reveal delay={60}>
          <div className="card-lift h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
            <span className="gradient-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground shadow-glow">
              <Coins className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">Live Currency Info</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                <span className="font-medium text-foreground">Official Currency:</span> {currencyName} ({currencySymbol} {currencyCode})
              </li>
              <li className="flex items-center gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                <span className="font-medium text-foreground">Live Exchange Rate:</span> {rateText}
              </li>
              <li className="flex items-center gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                Major credit cards & contactless mobile pay widely accepted.
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Other Essentials from Data */}
        {essentials.slice(0, 4).map((e, i) => {
          const Icon = iconMap[e.icon] ?? Landmark;
          return (
            <Reveal key={e.title} delay={(i + 2) * 60}>
              <div className="card-lift h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <span className="gradient-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground shadow-glow">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{e.title}</h3>
                <ul className="mt-3 space-y-2">
                  {e.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
