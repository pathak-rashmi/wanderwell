import { Bookmark, Heart } from "lucide-react";
import { destinations } from "@/lib/travel-data";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Wishlist({
  favorites,
  onToggleFavorite,
}: {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <Section id="wishlist">
      <SectionHeader
        eyebrow="Wishlist"
        title="Keep your someday list close"
        description="Save the places you're dreaming about and turn any of them into a real plan later."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.slice(0, 4).map((d, i) => {
          const fav = favorites.includes(d.id);
          return (
            <Reveal key={d.id} delay={i * 70}>
              <div className="card-lift group relative h-72 overflow-hidden rounded-3xl shadow-soft">
                <img
                  src={d.image}
                  alt={`${d.name}, ${d.country}`}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                <button
                  type="button"
                  onClick={() => onToggleFavorite(d.id)}
                  aria-pressed={fav}
                  aria-label={`${fav ? "Remove" : "Save"} ${d.name}`}
                  className="glass absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-110 active:scale-75"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      fav ? "scale-110 fill-destructive text-destructive" : "text-foreground",
                    )}
                    aria-hidden
                  />
                </button>
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="font-display text-lg font-bold text-primary-foreground">
                    {d.name}
                  </h3>
                  <p className="text-sm text-primary-foreground/80">{d.country}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass mt-3 w-full rounded-xl"
                    onClick={() => toast.success(`${d.name} saved to your wishlist`)}
                  >
                    <Bookmark className="mr-1.5 h-4 w-4" aria-hidden />
                    Save destination
                  </Button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
