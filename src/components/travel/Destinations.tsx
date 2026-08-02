import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import { destinations } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Destinations({
  favorites,
  onToggleFavorite,
}: {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  const [added, setAdded] = useState<string[]>([]);

  return (
    <Section id="destinations">
      <SectionHeader
        eyebrow="Destinations"
        title="Popular places travellers are planning right now"
        description="Curated stays, budgets and attractions — add any destination to your trip in one click."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, i) => {
          const fav = favorites.includes(d.id);
          const isAdded = added.includes(d.id);
          return (
            <Reveal key={d.id} delay={i * 70}>
              <article className="card-lift group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name}, ${d.country}`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(d.id)}
                    aria-pressed={fav}
                    aria-label={`${fav ? "Remove" : "Add"} ${d.name} ${fav ? "from" : "to"} wishlist`}
                    className="glass absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-110 active:scale-90"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        fav ? "scale-110 fill-destructive text-destructive" : "text-foreground",
                      )}
                      aria-hidden
                    />
                  </button>
                  <div className="glass absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
                    <WeatherIcon kind={d.weather} className="h-4 w-4 text-primary" />
                    {d.temp}°C
                  </div>
                  <div className="absolute right-4 bottom-3 left-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-xl font-bold text-primary-foreground">
                        {d.name}
                      </h3>
                      <p className="truncate text-sm text-primary-foreground/80">{d.country}</p>
                    </div>
                    <span className="glass flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-sunset text-sunset" aria-hidden />
                      {d.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-secondary p-3">
                      <div className="text-xs text-muted-foreground">Est. budget</div>
                      <div className="font-semibold">{d.budget}</div>
                    </div>
                    <div className="rounded-2xl bg-secondary p-3">
                      <div className="text-xs text-muted-foreground">Best time</div>
                      <div className="font-semibold">{d.bestTime}</div>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {d.attractions.map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "ripple w-full rounded-2xl",
                      isAdded
                        ? "bg-emerald text-emerald-foreground hover:bg-emerald/90"
                        : "gradient-brand text-primary-foreground hover:opacity-95",
                    )}
                    onClick={() => {
                      setAdded((prev) =>
                        prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id],
                      );
                      toast.success(
                        isAdded ? `${d.name} removed from trip` : `${d.name} added to your trip`,
                      );
                    }}
                  >
                    <Plus className="mr-1.5 h-4 w-4" aria-hidden />
                    {isAdded ? "Added to Trip" : "Add Trip"}
                  </Button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
