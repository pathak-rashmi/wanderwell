import { Compass, MapPin, Plane, Search, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-travel";

function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="glass rounded-2xl px-5 py-4 text-center">
      <div className="font-display text-2xl font-bold sm:text-3xl">
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Aerial view of a turquoise tropical coastline at golden hour"
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
      <div
        className="absolute inset-0 opacity-70 mix-blend-soft-light gradient-aurora"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-foreground shadow-soft sm:text-sm">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            One workspace for every part of your trip
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-6xl lg:text-7xl">
            Plan Smarter. <span className="text-gradient">Travel Better.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Organize your destinations, budget, itinerary, packing list, and trip details—all in
            one place.
          </p>

          <form
            className="glass mx-auto mt-8 flex w-full max-w-xl flex-col gap-2 rounded-3xl p-2 shadow-lift sm:flex-row sm:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="hero-search" className="sr-only">
              Where do you want to go?
            </label>
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <input
                id="hero-search"
                type="search"
                placeholder="Where do you want to go?"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              className="ripple gradient-brand h-12 shrink-0 rounded-2xl px-6 text-primary-foreground shadow-glow hover:opacity-95"
            >
              <Search className="mr-2 h-4 w-4" aria-hidden />
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="ripple gradient-brand rounded-2xl text-primary-foreground shadow-glow hover:opacity-95"
            >
              <a href="#itinerary">
                <Plane className="mr-2 h-4 w-4" aria-hidden />
                Start Planning
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass rounded-2xl">
              <a href="#destinations">
                <Compass className="mr-2 h-4 w-4" aria-hidden />
                Explore Destinations
              </a>
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat target={50} suffix="+" label="Destinations" />
            <Stat target={10} suffix="K+" label="Trips Planned" />
            <Stat target={95} suffix="%" label="Happy Travelers" />
          </div>
        </div>
      </div>
    </section>
  );
}
