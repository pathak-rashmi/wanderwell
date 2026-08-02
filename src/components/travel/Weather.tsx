import { Droplets, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";
import { forecast } from "@/lib/travel-data";
import { Reveal, Section, SectionHeader } from "./Section";
import { WeatherIcon } from "./WeatherIcon";

const metrics = [
  { icon: Thermometer, label: "Feels like", value: "29°C" },
  { icon: Droplets, label: "Humidity", value: "58%" },
  { icon: Wind, label: "Wind", value: "12 km/h" },
  { icon: Sunrise, label: "Sunrise", value: "06:24" },
  { icon: Sunset, label: "Sunset", value: "20:51" },
];

export function Weather() {
  return (
    <Section id="weather">
      <SectionHeader
        eyebrow="Weather"
        title="Pack for the forecast, not the guess"
        description="Seven-day outlook for your destination with the details that actually change your plans."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="gradient-brand relative h-full overflow-hidden rounded-3xl p-8 text-primary-foreground shadow-glow">
            <div className="float-slow absolute -top-10 -right-8 opacity-25">
              <WeatherIcon kind="sun" className="h-48 w-48" />
            </div>
            <p className="text-sm font-medium opacity-90">Santorini, Greece</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-6xl font-extrabold">27°</span>
              <span className="pb-2 text-lg opacity-90">Sunny</span>
            </div>
            <p className="mt-2 text-sm opacity-80">Clear skies through the afternoon</p>

            <dl className="mt-8 grid grid-cols-2 gap-3">
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
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">7-day forecast</h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {forecast.map((f) => (
                <div
                  key={f.day}
                  className="card-lift rounded-2xl border border-border bg-background p-4 text-center"
                >
                  <div className="text-xs font-semibold text-muted-foreground">{f.day}</div>
                  <WeatherIcon kind={f.kind} className="mx-auto mt-3 h-7 w-7 text-primary" />
                  <div className="mt-3 font-display text-lg font-bold">{f.temp}°</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
              Thursday brings showers — move the caldera hike to Friday and keep the museum day
              flexible.
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
