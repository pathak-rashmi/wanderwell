import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchWeather, type WeatherData } from "@/services/weatherService";
import { searchDestinations, type DestinationSearchResult } from "@/services/geocodingService";
import {
  generateItineraryWithGemini,
  type GeneratedItinerary,
  type ItineraryRequestInput,
} from "@/services/aiItineraryService";
import { saveTripToSupabase } from "@/services/tripService";
import { toast } from "sonner";

export type TripParams = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  travelStyle: string;
  interests: string[];
  latitude?: number;
  longitude?: number;
  country?: string;
};

export type SelectedDestination = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type TripContextType = {
  // Destination search state
  selectedDestination: SelectedDestination;
  selectDestinationByName: (name: string, country?: string, lat?: number, lng?: number) => Promise<void>;
  
  // Trip planner inputs
  tripParams: TripParams;
  setTripParams: React.Dispatch<React.SetStateAction<TripParams>>;

  // Weather state
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  refetchWeather: () => Promise<void>;

  // Itinerary & AI state
  itinerary: GeneratedItinerary | null;
  itineraryLoading: boolean;
  itineraryError: string | null;
  generateTrip: (customParams?: Partial<TripParams>) => Promise<void>;

  // Budget state
  budgets: Record<string, number>;
  updateBudgetValue: (id: string, val: number) => void;
  totalBudgetCost: number;

  // Persistence
  isSaving: boolean;
  saveActiveTrip: () => Promise<void>;

  // Manual itinerary modification
  updateActivity: (dayNumber: number, actIndex: number, newTitle: string) => void;
  addActivity: (dayNumber: number, time: string, title: string, place?: string) => void;
  deleteActivity: (dayNumber: number, actIndex: number) => void;
};

const DEFAULT_DESTINATION: SelectedDestination = {
  name: "Santorini",
  country: "Greece",
  latitude: 36.3932,
  longitude: 25.4615,
};

const todayISO = new Date().toISOString().split("T")[0] || "2026-08-08";
const nextWeekISO = new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0] || "2026-08-15";

const DEFAULT_TRIP_PARAMS: TripParams = {
  destination: "Santorini",
  startDate: todayISO,
  endDate: nextWeekISO,
  travelers: 2,
  budget: 4500,
  travelStyle: "Adventure",
  interests: ["Sightseeing", "Food & Dining", "Culture & History"],
  latitude: 36.3932,
  longitude: 25.4615,
  country: "Greece",
};

const INITIAL_BUDGETS: Record<string, number> = {
  flights: 850,
  hotels: 1200,
  food: 480,
  transport: 220,
  activities: 390,
  shopping: 260,
  emergency: 300,
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<SelectedDestination>(DEFAULT_DESTINATION);
  const [tripParams, setTripParams] = useState<TripParams>(DEFAULT_TRIP_PARAMS);

  // Weather
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Itinerary
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [itineraryLoading, setItineraryLoading] = useState<boolean>(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);

  // Budget
  const [budgets, setBudgets] = useState<Record<string, number>>(INITIAL_BUDGETS);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load weather on initial mount or destination change
  const loadWeatherForLocation = async (name: string, lat?: number, lng?: number, country?: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeather(name, lat, lng, country);
      setWeather(data);
      setSelectedDestination({
        name: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (err: any) {
      console.error("Error loading weather:", err);
      setWeatherError(err?.message || "Unable to load weather. Please try again.");
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    void loadWeatherForLocation(DEFAULT_DESTINATION.name, DEFAULT_DESTINATION.latitude, DEFAULT_DESTINATION.longitude, DEFAULT_DESTINATION.country);
  }, []);

  const selectDestinationByName = async (name: string, country?: string, lat?: number, lng?: number) => {
    let targetLat = lat;
    let targetLng = lng;
    let targetCountry = country || "";

    if (targetLat === undefined || targetLng === undefined) {
      try {
        const results = await searchDestinations(name);
        const first = results[0];
        if (first) {
          targetLat = first.latitude;
          targetLng = first.longitude;
          targetCountry = first.country;
          name = first.city;
        }
      } catch {
        // Fallback to name search
      }
    }

    setTripParams((prev) => {
      const next: TripParams = {
        ...prev,
        destination: name,
        country: targetCountry,
      };
      if (targetLat !== undefined) next.latitude = targetLat;
      if (targetLng !== undefined) next.longitude = targetLng;
      return next;
    });

    void loadWeatherForLocation(name, targetLat, targetLng, targetCountry);
  };

  const generateTrip = async (customParams?: Partial<TripParams>) => {
    const activeParams = { ...tripParams, ...customParams };

    if (!activeParams.destination || !activeParams.destination.trim()) {
      toast.error("Please enter a valid destination.");
      return;
    }

    setItineraryLoading(true);
    setItineraryError(null);

    // Calculate days between start date and end date
    let numDays = 4;
    if (activeParams.startDate && activeParams.endDate) {
      const start = new Date(activeParams.startDate);
      const end = new Date(activeParams.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      numDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    }

    // Trigger geocoding & weather update concurrently
    void selectDestinationByName(activeParams.destination);

    try {
      const reqInput: ItineraryRequestInput = {
        destination: activeParams.destination,
        days: numDays,
        budget: Number(activeParams.budget) || 1000,
        travelers: Number(activeParams.travelers) || 1,
        travelStyle: activeParams.travelStyle,
        interests: activeParams.interests,
      };

      const result = await generateItineraryWithGemini(reqInput);
      setItinerary(result);

      // Update budgets dynamically from generated trip
      if (result.estimatedBudget) {
        setBudgets({
          flights: result.estimatedBudget.transport,
          hotels: result.estimatedBudget.accommodation,
          food: result.estimatedBudget.food,
          transport: Math.round(result.estimatedBudget.transport * 0.3),
          activities: result.estimatedBudget.activities,
          shopping: Math.round(result.estimatedBudget.miscellaneous * 0.5),
          emergency: Math.round(result.estimatedBudget.miscellaneous * 0.5),
        });
      }

      toast.success(
        result.isAiGenerated
          ? `Gemini generated a ${numDays}-day itinerary for ${activeParams.destination}!`
          : `Created a ${numDays}-day trip plan for ${activeParams.destination}!`,
      );
    } catch (err: any) {
      console.error("Error generating trip:", err);
      setItineraryError("Failed to generate itinerary. Please try again.");
      toast.error("Unable to generate itinerary. Please try again.");
    } finally {
      setItineraryLoading(false);
    }
  };

  const updateBudgetValue = (id: string, val: number) => {
    setBudgets((prev) => ({
      ...prev,
      [id]: Math.max(0, val),
    }));
  };

  const totalBudgetCost = Object.values(budgets).reduce((sum, current) => sum + current, 0);

  const saveActiveTrip = async () => {
    setIsSaving(true);
    try {
      await saveTripToSupabase({
        destination: tripParams.destination,
        start_date: tripParams.startDate,
        end_date: tripParams.endDate,
        travelers: tripParams.travelers,
        budget: tripParams.budget,
        travel_style: tripParams.travelStyle,
        itinerary: itinerary || { note: "Draft trip" },
      });
      toast.success(`Saved trip to ${tripParams.destination} in your account!`);
    } catch (err: any) {
      console.error("Error saving trip:", err);
      toast.error(err?.message || "Failed to save trip. Please make sure you are logged in.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateActivity = (dayNumber: number, actIndex: number, newTitle: string) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.map((d) => {
      if (d.day !== dayNumber) return d;
      const updatedActs = d.activities.map((act, idx) =>
        idx === actIndex ? { ...act, description: newTitle, place: newTitle } : act,
      );
      return { ...d, activities: updatedActs };
    });
    setItinerary({ ...itinerary, days: updatedDays });
  };

  const addActivity = (dayNumber: number, time: string, title: string, place?: string) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.map((d) => {
      if (d.day !== dayNumber) return d;
      const newAct = {
        time: time || "10:00",
        place: place || title,
        description: title,
        estimatedCost: 20,
      };
      return { ...d, activities: [...d.activities, newAct] };
    });
    setItinerary({ ...itinerary, days: updatedDays });
  };

  const deleteActivity = (dayNumber: number, actIndex: number) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.map((d) => {
      if (d.day !== dayNumber) return d;
      return {
        ...d,
        activities: d.activities.filter((_, idx) => idx !== actIndex),
      };
    });
    setItinerary({ ...itinerary, days: updatedDays });
  };

  return (
    <TripContext.Provider
      value={{
        selectedDestination,
        selectDestinationByName,
        tripParams,
        setTripParams,
        weather,
        weatherLoading,
        weatherError,
        refetchWeather: () =>
          loadWeatherForLocation(
            selectedDestination.name,
            selectedDestination.latitude,
            selectedDestination.longitude,
            selectedDestination.country,
          ),
        itinerary,
        itineraryLoading,
        itineraryError,
        generateTrip,
        budgets,
        updateBudgetValue,
        totalBudgetCost,
        isSaving,
        saveActiveTrip,
        updateActivity,
        addActivity,
        deleteActivity,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
