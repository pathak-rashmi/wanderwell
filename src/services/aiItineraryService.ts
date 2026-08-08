export type ActivityItem = {
  time: string;
  place: string;
  description: string;
  estimatedCost: number;
};

export type DayPlan = {
  day: number;
  title: string;
  activities: ActivityItem[];
};

export type EstimatedBudgetBreakdown = {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
};

export type GeneratedItinerary = {
  destination: string;
  summary: string;
  days: DayPlan[];
  estimatedBudget: EstimatedBudgetBreakdown;
  tips: string[];
  isAiGenerated?: boolean;
};

export type ItineraryRequestInput = {
  destination: string;
  days: number;
  budget: number;
  travelers: number;
  travelStyle?: string;
  interests?: string[];
};

export async function generateItineraryWithGemini(
  input: ItineraryRequestInput,
): Promise<GeneratedItinerary> {
  // First, try calling our API endpoint POST /api/itinerary
  try {
    const res = await fetch("/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = (await res.json()) as GeneratedItinerary;
      if (data && data.days && data.days.length > 0) {
        return { ...data, isAiGenerated: true };
      }
    }
  } catch (apiErr) {
    console.warn("API route /api/itinerary not available, trying client AI call fallback...", apiErr);
  }

  // Client-side fallback to Gemini API if GEMINI_API_KEY is defined in environment
  const geminiApiKey =
    import.meta.env["GEMINI_API_KEY"] || import.meta.env["VITE_GEMINI_API_KEY"];

  if (geminiApiKey) {
    try {
      return await callGeminiDirectly(input, geminiApiKey);
    } catch (err) {
      console.error("Gemini direct call failed:", err);
    }
  }

  // Standard structured intelligent fallback itinerary
  return generateFallbackItinerary(input);
}

export async function callGeminiDirectly(
  input: ItineraryRequestInput,
  apiKey: string,
): Promise<GeneratedItinerary> {
  const prompt = `You are an expert travel planner. Create a highly detailed ${input.days}-day trip itinerary for ${input.travelers} traveler(s) visiting ${input.destination}.
Budget: ${input.budget} USD/INR.
Travel Style: ${input.travelStyle || "General"}.
Interests: ${(input.interests || []).join(", ") || "Must-see highlights, local cuisine"}.

Respond ONLY with raw valid JSON matching this EXACT structure (no markdown formatting, no backticks, no markdown fence):
{
  "destination": "${input.destination}",
  "summary": "Brief engaging overview of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day title e.g. Arrival & Highlights",
      "activities": [
        {
          "time": "09:00",
          "place": "Place or attraction name",
          "description": "Short description of what to do",
          "estimatedCost": 50
        }
      ]
    }
  ],
  "estimatedBudget": {
    "transport": ${Math.round(input.budget * 0.2)},
    "accommodation": ${Math.round(input.budget * 0.4)},
    "food": ${Math.round(input.budget * 0.2)},
    "activities": ${Math.round(input.budget * 0.15)},
    "miscellaneous": ${Math.round(input.budget * 0.05)},
    "total": ${input.budget}
  },
  "tips": [
    "Practical tip 1",
    "Practical tip 2"
  ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API error status: ${response.status}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleanJson) as GeneratedItinerary;
  return { ...parsed, isAiGenerated: true };
}

export function generateFallbackItinerary(input: ItineraryRequestInput): GeneratedItinerary {
  const numDays = Math.max(1, Math.min(input.days || 3, 14));
  const dest = input.destination || "Destination";
  const b = input.budget || 1000;

  const transport = Math.round(b * 0.25);
  const accommodation = Math.round(b * 0.4);
  const food = Math.round(b * 0.18);
  const activities = Math.round(b * 0.12);
  const miscellaneous = Math.round(b * 0.05);
  const total = transport + accommodation + food + activities + miscellaneous;

  const days: DayPlan[] = [];
  const activityTemplates = [
    { time: "09:00", place: `${dest} Landmark & Heritage Walk`, description: "Explore famous city sights and local architectural treasures." },
    { time: "13:00", place: "Local Speciality Lunch", description: "Sample authentic regional dishes at a top-rated local café." },
    { time: "16:00", place: "Cultural Quarter & Shopping", description: "Browse traditional markets, artisan craft stalls, and local boutiques." },
    { time: "19:30", place: "Sunset Dinner & Atmosphere", description: "Enjoy scenic dining and evening atmosphere by the waterfront." },
  ];

  for (let d = 1; d <= numDays; d++) {
    days.push({
      day: d,
      title: d === 1 ? `Arrival & Initial Exploration of ${dest}` : d === numDays ? `Final Sights & Departure from ${dest}` : `Discovering ${dest} — Day ${d}`,
      activities: activityTemplates.map((act, idx) => ({
        ...act,
        estimatedCost: Math.round(activities / (numDays * 4) + (idx * 5)),
      })),
    });
  }

  return {
    destination: dest,
    summary: `Customized ${numDays}-day ${input.travelStyle || "curated"} trip to ${dest} for ${input.travelers} traveler(s) with an estimated budget of ${total}.`,
    days,
    estimatedBudget: {
      transport,
      accommodation,
      food,
      activities,
      miscellaneous,
      total,
    },
    tips: [
      `Book popular attractions in ${dest} ahead of time.`,
      "Keep digital copies of essential travel documents.",
      "Check local weather forecasts daily to adjust outdoor plans.",
    ],
    isAiGenerated: false,
  };
}
