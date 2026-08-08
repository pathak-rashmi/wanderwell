import { useState, useEffect, useRef } from "react";
import { Compass, Loader2, MapPin, Plane, Search, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-travel";
import { searchDestinations, type DestinationSearchResult } from "@/services/geocodingService";
import { useTrip } from "@/contexts/TripContext";

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
  const { selectDestinationByName, generateTrip } = useTrip();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DestinationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    setHasSearched(true);
    const timer = setTimeout(() => {
      searchDestinations(query)
        .then((res) => {
          setResults(res);
          setIsOpen(true);
        })
        .catch((err) => {
          console.error("Hero search error:", err);
          setResults([]);
        })
        .finally(() => {
          setSearching(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dest: DestinationSearchResult) => {
    setQuery(dest.displayName);
    setIsOpen(false);
    void selectDestinationByName(dest.city, dest.country, dest.latitude, dest.longitude);
    const el = document.getElementById("planner") || document.getElementById("weather");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const first = results[0];
    if (first) {
      handleSelect(first);
    } else {
      void selectDestinationByName(query.trim());
      const el = document.getElementById("planner") || document.getElementById("weather");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Aerial view of a turquoise tropical coastline at golden hour"
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-background/35" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="glass mx-auto max-w-3xl rounded-[2.5rem] px-6 py-10 text-center shadow-lift sm:px-12 sm:py-14">
          <span className="sr-only">Travel Planner</span>
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

          <div className="relative mx-auto mt-8 max-w-xl" ref={dropdownRef}>
            <form
              className="glass flex w-full flex-col gap-2 rounded-3xl p-2 shadow-lift sm:flex-row sm:items-center"
              onSubmit={handleSubmit}
            >
              <label htmlFor="hero-search" className="sr-only">
                Where do you want to go?
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setIsOpen(true);
                  }}
                  placeholder="Where do you want to go? (e.g. Goa, Paris, Tokyo)"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                {searching ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
              </div>
              <Button
                type="submit"
                className="ripple gradient-brand h-12 shrink-0 rounded-2xl px-6 text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Search className="mr-2 h-4 w-4" aria-hidden />
                Search
              </Button>
            </form>

            {/* Floating Autocomplete Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-md p-2 shadow-lift">
                {results.length > 0 ? (
                  results.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleSelect(dest)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors hover:bg-accent/60"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-semibold">{dest.city}</span>
                          <span className="ml-1 text-xs text-muted-foreground">({dest.country})</span>
                        </div>
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground font-mono">
                        {dest.latitude.toFixed(2)}°, {dest.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))
                ) : hasSearched && !searching ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No destinations found for "{query}". Press Enter to plan for this location.
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="ripple gradient-brand rounded-2xl text-primary-foreground shadow-glow hover:opacity-95"
            >
              <a href="#planner">
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
