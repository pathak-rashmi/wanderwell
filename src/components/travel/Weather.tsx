import { useState } from "react";
import {
  AlertCircle,
  Droplets,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import { Reveal, Section, SectionHeader } from "./Section";
import { WeatherIcon } from "./WeatherIcon";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";

export function Weather() {
  const { weather, weatherLoading, weatherError, refetchWeather, selectDestinationByName } = useTrip();
  const [searchCity, setSearchCity] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    setIsSearching(true);
    selectDestinationByName(searchCity.trim())
      .finally(() => setIsSearching(false));
  };

  const metrics = [
    { icon: Thermometer, label: "Feels like", value: weather ? `${weather.feelsLike}°C` : "--" },
    { icon: Droplets, label: "Humidity", value: weather ? `${weather.humidity}%` : "--" },
    { icon: Wind, label: "Wind", value: weather ? `${weather.windSpeed} km/h` : "--" },
    { icon: Sunrise, label: "Sunrise", value: weather ? weather.sunrise : "--" },
    { icon: Sunset, label: "Sunset", value: weather ? weather.sunset : "--" },
  ];

  return (
    <Section id="weather">
      <SectionHeader
        eyebrow="Weather"
        title="Pack for the forecast, not the guess"
        description="Seven-day outlook for your destination with live details that actually change your plans."
      />

      {/* Quick City Search in Weather section */}
      <div className="mt-6 flex justify-center">
        <form
          onSubmit={handleCitySearch}
          className="glass flex w-full max-w-md items-center gap-2 rounded-2xl p-1.5 shadow-soft"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search weather for any city..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSearching || weatherLoading}
            className="ripple gradient-brand rounded-xl text-xs font-semibold text-primary-foreground"
          >
            {isSearching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Search className="mr-1 h-3.5 w-3.5" />
                Check
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Main Current Weather Card */}
        <Reveal>
          <div className="gradient-brand relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 text-primary-foreground shadow-glow min-h-[360px]">
            <div className="float-slow absolute -top-10 -right-8 opacity-25">
              <WeatherIcon kind={weather?.kind || "sun"} className="h-48 w-48" />
            </div>

            {weatherLoading ? (
              <div className="my-auto flex flex-col items-center justify-center space-y-3 text-center">
                <Loader2 className="h-10 w-10 animate-spin opacity-90" />
                <p className="text-sm font-medium">Fetching live weather data...</p>
              </div>
            ) : weatherError ? (
              <div className="my-auto flex flex-col items-center justify-center space-y-3 text-center">
                <AlertCircle className="h-10 w-10 text-white/80" />
                <p className="text-sm font-medium">{weatherError}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void refetchWeather()}
                  className="mt-2 text-xs font-semibold"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Try again
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium opacity-90">
                    {weather?.city}, {weather?.country}
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-6xl font-extrabold">{weather?.temp}°</span>
                    <span className="pb-2 text-lg opacity-90">{weather?.condition}</span>
                  </div>
                  <p className="mt-2 text-sm opacity-80">
                    Real-time weather data & live climate metrics
                  </p>
                </div>

                <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                  {metrics.map((m) => (
                    <div key={m.label} className="glass rounded-2xl px-4 py-3">
                      <dt className="flex items-center gap-1.5 text-xs opacity-90">
                        <m.icon className="h-3.5 w-3.5" aria-hidden />
                        {m.label}
                      </dt>
                      <dd className="mt-1 font-display text-lg font-semibold">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </Reveal>

        {/* 7-Day Forecast Card */}
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft min-h-[360px]">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">7-day forecast</h3>
                {weather?.city ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {weather.city}
                  </span>
                ) : null}
              </div>

              {weatherLoading ? (
                <div className="my-16 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : weatherError ? (
                <div className="my-12 text-center text-sm text-muted-foreground">
                  Forecast unavailable. Please check location or retry.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {(weather?.forecast || []).map((f, idx) => (
                    <div
                      key={`${f.day}-${idx}`}
                      className="card-lift rounded-2xl border border-border bg-background p-3.5 text-center"
                    >
                      <div className="text-xs font-semibold text-muted-foreground">{f.day}</div>
                      <WeatherIcon kind={f.kind} className="mx-auto mt-2.5 h-7 w-7 text-primary" />
                      <div className="mt-2 font-display text-base font-bold">{f.temp}°</div>
                      <div className="text-[11px] text-muted-foreground">{f.tempMin}°</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
              💡 {weather?.kind === "rain" || weather?.kind === "cloud"
                ? "Rain or cloudy weather expected — plan indoor museums or cozy café stops."
                : "Great outdoor conditions! Ideal for sightseeing, walking tours, and sunset views."}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
