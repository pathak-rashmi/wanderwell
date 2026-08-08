import { useState } from "react";
import {
  Calendar,
  Compass,
  DollarSign,
  Heart,
  Loader2,
  MapPin,
  RefreshCw,
  Save,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeader } from "./Section";
import { useTrip } from "@/contexts/TripContext";
import { searchDestinations, type DestinationSearchResult } from "@/services/geocodingService";

const TRAVEL_STYLES = ["Adventure", "Luxury", "Budget", "Relaxation", "Family", "Cultural"];
const INTEREST_OPTIONS = [
  "Beaches & Oceans",
  "Food & Dining",
  "Culture & History",
  "Hiking & Nature",
  "Shopping & Markets",
  "Nightlife",
  "Photography",
];

export function TripPlanner() {
  const {
    tripParams,
    setTripParams,
    generateTrip,
    itineraryLoading,
    itineraryError,
    saveActiveTrip,
    isSaving,
    itinerary,
  } = useTrip();

  const [searchResults, setSearchResults] = useState<DestinationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleDestinationChange = async (val: string) => {
    setTripParams((prev) => ({ ...prev, destination: val }));
    if (val.trim().length >= 2) {
      setSearching(true);
      try {
        const results = await searchDestinations(val);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    } else {
      setShowSearchDropdown(false);
    }
  };

  const selectSearchResult = (item: DestinationSearchResult) => {
    setTripParams((prev) => ({
      ...prev,
      destination: item.city,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
    setShowSearchDropdown(false);
  };

  const toggleInterest = (interest: string) => {
    setTripParams((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void generateTrip();
  };

  return (
    <Section id="planner" className="gradient-aurora py-16">
      <SectionHeader
        eyebrow="Trip Planner"
        title="AI-Powered Trip Generator"
        description="Enter your destination, dates, budget and preferences — Gemini AI creates a personalized itinerary and cost plan instantly."
      />

      <Reveal className="mt-10">
        <form
          onSubmit={handleSubmit}
          className="glass mx-auto max-w-4xl rounded-3xl p-6 shadow-lift sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Destination */}
            <div className="relative">
              <label htmlFor="planner-dest" className="block text-xs font-semibold text-foreground">
                Destination *
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <input
                  id="planner-dest"
                  type="text"
                  required
                  value={tripParams.destination}
                  onChange={(e) => void handleDestinationChange(e.target.value)}
                  placeholder="e.g. Goa, Paris, Tokyo"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {searching ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchResults.length > 0 ? (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-lift">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => selectSearchResult(res)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-accent/60"
                    >
                      <span className="font-semibold text-foreground">{res.city}</span>
                      <span className="text-muted-foreground">{res.country}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Dates */}
            <div>
              <label htmlFor="planner-start" className="block text-xs font-semibold text-foreground">
                Start Date
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <Calendar className="h-4 w-4 shrink-0 text-primary" />
                <input
                  id="planner-start"
                  type="date"
                  value={tripParams.startDate}
                  onChange={(e) => setTripParams((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="planner-end" className="block text-xs font-semibold text-foreground">
                End Date
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <Calendar className="h-4 w-4 shrink-0 text-primary" />
                <input
                  id="planner-end"
                  type="date"
                  value={tripParams.endDate}
                  onChange={(e) => setTripParams((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label htmlFor="planner-travelers" className="block text-xs font-semibold text-foreground">
                Travelers
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <Users className="h-4 w-4 shrink-0 text-primary" />
                <input
                  id="planner-travelers"
                  type="number"
                  min={1}
                  max={20}
                  value={tripParams.travelers}
                  onChange={(e) => setTripParams((p) => ({ ...p, travelers: Math.max(1, Number(e.target.value)) }))}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="planner-budget" className="block text-xs font-semibold text-foreground">
                Budget (USD / INR)
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <DollarSign className="h-4 w-4 shrink-0 text-primary" />
                <input
                  id="planner-budget"
                  type="number"
                  min={100}
                  step={100}
                  value={tripParams.budget}
                  onChange={(e) => setTripParams((p) => ({ ...p, budget: Math.max(0, Number(e.target.value)) }))}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label htmlFor="planner-style" className="block text-xs font-semibold text-foreground">
                Travel Style
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-soft">
                <Compass className="h-4 w-4 shrink-0 text-primary" />
                <select
                  id="planner-style"
                  value={tripParams.travelStyle}
                  onChange={(e) => setTripParams((p) => ({ ...p, travelStyle: e.target.value }))}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  {TRAVEL_STYLES.map((style) => (
                    <option key={style} value={style} className="bg-card text-foreground">
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-foreground">
              Interests & Preferences
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = tripParams.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`ripple flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? "gradient-brand border-transparent text-primary-foreground shadow-glow"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${selected ? "fill-current" : ""}`} />
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {itineraryError ? (
            <div className="mt-6 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
              <p className="font-semibold">{itineraryError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => void generateTrip()}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry Trip Generation
              </Button>
            </div>
          ) : null}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Button
              type="submit"
              disabled={itineraryLoading}
              className="ripple gradient-brand h-12 flex-1 rounded-2xl text-base font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-50 sm:flex-none sm:px-8"
            >
              {itineraryLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Itinerary with Gemini AI...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate AI Trip
                </>
              )}
            </Button>

            {itinerary ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void saveActiveTrip()}
                disabled={isSaving}
                className="glass h-12 rounded-2xl px-6 font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Trip...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4 text-primary" />
                    Save Trip
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </form>
      </Reveal>
    </Section>
  );
}
