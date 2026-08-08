import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";
import { Navbar } from "@/components/travel/Navbar";
import { Hero } from "@/components/travel/Hero";
import { PopularSearches } from "@/components/travel/PopularSearches";
import { Destinations } from "@/components/travel/Destinations";
import { BudgetCalculator } from "@/components/travel/BudgetCalculator";
import { Itinerary } from "@/components/travel/Itinerary";
import { Packing } from "@/components/travel/Packing";
import { Weather } from "@/components/travel/Weather";
import { Dashboard } from "@/components/travel/Dashboard";
import { MapSection } from "@/components/travel/MapSection";
import { Essentials } from "@/components/travel/Essentials";
import { Wishlist } from "@/components/travel/Wishlist";
import { Gallery } from "@/components/travel/Gallery";
import { Testimonials } from "@/components/travel/Testimonials";
import { Faq } from "@/components/travel/Faq";
import { Footer } from "@/components/travel/Footer";
import { FloatingUi } from "@/components/travel/FloatingUi";
import { initialPacking, type PackCategory } from "@/lib/travel-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const title = "Travel Planner — Plan Smarter. Travel Better.";
const description =
  "Organize destinations, budget, itinerary, packing list and trip details in one premium travel planning workspace.";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Splash() {
  return (
    <div className="gradient-aurora fixed inset-0 z-[100] grid place-items-center">
      <div className="w-[min(100%-3rem,22rem)] text-center">
        <span className="gradient-brand float-slow mx-auto grid h-16 w-16 place-items-center rounded-3xl text-primary-foreground shadow-glow">
          <Globe2 className="h-8 w-8" aria-hidden />
        </span>
        <p className="mt-5 font-display text-lg font-bold">Travel Planner</p>
        <p className="text-sm text-muted-foreground">Preparing your trip workspace…</p>
        <div className="mt-6 space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-4/5 rounded-full" />
          <Skeleton className="h-3 w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(["santorini"]);
  const [packing, setPacking] = useState<PackCategory[]>(initialPacking);

  useEffect(() => {
    if (!authLoading && !user) {
      void navigate({ to: "/auth" });
      return;
    }
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [authLoading, navigate, user]);

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  if (authLoading || !user) return <Splash />;

  return (
    <div className="min-h-screen bg-background">
      {loading ? <Splash /> : null}
      <Navbar />
      <main className="animate-in fade-in duration-700">
        <Hero />
        <PopularSearches />
        <Destinations favorites={favorites} onToggleFavorite={toggleFavorite} />
        <BudgetCalculator />
        <Itinerary />
        <Packing categories={packing} setCategories={setPacking} />
        <Weather />
        <Dashboard packing={packing} />
        <MapSection />
        <Essentials />
        <Wishlist favorites={favorites} onToggleFavorite={toggleFavorite} />
        <Gallery />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <FloatingUi />
    </div>
  );
}
