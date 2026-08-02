import { Search, TrendingUp } from "lucide-react";
import { Reveal, Section } from "./Section";

const searches = ["Bali on a budget", "Northern lights", "Kyoto in spring", "Amalfi road trip", "Solo Lisbon", "Safari Kenya"];

export function PopularSearches() {
  return (
    <Section id="searches" className="py-14 sm:py-16">
      <Reveal>
        <div className="glass grid gap-4 rounded-3xl p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-emerald" aria-hidden />
            Popular searches
          </div>
          <ul className="flex flex-wrap gap-2">
            {searches.map((s) => (
              <li key={s}>
                <a
                  href="#destinations"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary"
                >
                  <Search className="h-3 w-3" aria-hidden />
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
