import { Bus, Coins, Landmark, Lightbulb, PartyPopper, Phone, UtensilsCrossed } from "lucide-react";
import { essentials } from "@/lib/travel-data";
import { Reveal, Section, SectionHeader } from "./Section";

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
  return (
    <Section id="essentials" className="gradient-aurora">
      <SectionHeader
        eyebrow="Local guide"
        title="Food, culture and the practical stuff"
        description="The details that usually live in ten browser tabs, collected next to your itinerary."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {essentials.map((e, i) => {
          const Icon = iconMap[e.icon] ?? Landmark;
          return (
            <Reveal key={e.title} delay={i * 60}>
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
