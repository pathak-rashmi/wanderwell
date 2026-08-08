import { supabase } from "@/lib/supabase";
import type { GeneratedItinerary } from "./itineraryService";

export type SavedTrip = {
  id?: string | undefined;
  user_id?: string | undefined;
  destination: string;
  start_date?: string | undefined;
  end_date?: string | undefined;
  travelers?: number | undefined;
  budget?: number | undefined;
  travel_style?: string | undefined;
  itinerary: GeneratedItinerary | Record<string, any>;
  created_at?: string | undefined;
  updated_at?: string | undefined;
};

export async function saveTripToSupabase(tripData: SavedTrip) {
  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // Guest mode
  }

  const startDate = tripData.start_date || new Date().toISOString().split("T")[0] || "2026-08-08";
  const endDate = tripData.end_date || new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0] || "2026-08-12";

  const payload: SavedTrip = {
    user_id: userId || "guest",
    destination: tripData.destination,
    start_date: startDate,
    end_date: endDate,
    travelers: tripData.travelers || 1,
    budget: tripData.budget || 0,
    travel_style: tripData.travel_style || "General",
    itinerary: tripData.itinerary,
    updated_at: new Date().toISOString(),
  };

  if (userId && userId !== "guest") {
    const { data, error } = await supabase
      .from("trips")
      .insert([payload])
      .select()
      .single();

    if (!error && data) return data;
  }

  // Local storage fallback for guest mode / local saving
  try {
    const existingStr = localStorage.getItem("wanderwell_saved_trips") || "[]";
    const existing = JSON.parse(existingStr) as SavedTrip[];
    const newTrip: SavedTrip = { ...payload, id: `trip_${Date.now()}` };
    existing.unshift(newTrip);
    localStorage.setItem("wanderwell_saved_trips", JSON.stringify(existing));
    return newTrip;
  } catch (err) {
    console.error("Local storage save error:", err);
    return payload;
  }
}

export async function getUserTrips() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) return data;
    }
  } catch {
    // Guest fallback
  }

  try {
    const existingStr = localStorage.getItem("wanderwell_saved_trips") || "[]";
    return JSON.parse(existingStr) as SavedTrip[];
  } catch {
    return [];
  }
}
