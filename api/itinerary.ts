import type { Request, Response } from "express";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { destination, days = 3, budget = 1000, travelers = 1, travelStyle = "Adventure", interests = [] } = req.body || {};

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // Return fallback structured payload if API key is not configured on server
    return res.status(200).json(getFallbackPayload(destination, days, budget, travelers, travelStyle));
  }

  try {
    const prompt = `You are an expert travel planner. Create a highly detailed ${days}-day trip itinerary for ${travelers} traveler(s) visiting ${destination}.
Budget: ${budget}.
Travel Style: ${travelStyle}.
Interests: ${interests.join(", ") || "General highlights"}.

Return ONLY raw valid JSON (no markdown ticks, no code blocks):
{
  "destination": "${destination}",
  "summary": "Engaging summary of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "activities": [
        {
          "time": "09:00",
          "place": "Attraction",
          "description": "Activity details",
          "estimatedCost": 50
        }
      ]
    }
  ],
  "estimatedBudget": {
    "transport": ${Math.round(budget * 0.2)},
    "accommodation": ${Math.round(budget * 0.4)},
    "food": ${Math.round(budget * 0.2)},
    "activities": ${Math.round(budget * 0.15)},
    "miscellaneous": ${Math.round(budget * 0.05)},
    "total": ${budget}
  },
  "tips": ["Tip 1", "Tip 2"]
}`;

    const geminiRes = await fetch(
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

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return res.status(200).json(getFallbackPayload(destination, days, budget, travelers, travelStyle));
    }

    const result = await geminiRes.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(200).json(getFallbackPayload(destination, days, budget, travelers, travelStyle));
    }

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const itinerary = JSON.parse(cleanJson);
    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Itinerary endpoint error:", error);
    return res.status(200).json(getFallbackPayload(destination, days, budget, travelers, travelStyle));
  }
}

function getFallbackPayload(destination: string, days: number, budget: number, travelers: number, travelStyle: string) {
  const d = Math.max(1, Math.min(days, 14));
  const transport = Math.round(budget * 0.25);
  const accommodation = Math.round(budget * 0.4);
  const food = Math.round(budget * 0.2);
  const activities = Math.round(budget * 0.1);
  const miscellaneous = Math.round(budget * 0.05);

  const dayList = [];
  for (let i = 1; i <= d; i++) {
    dayList.push({
      day: i,
      title: i === 1 ? `Arrival & Highlights of ${destination}` : `Exploring ${destination} Day ${i}`,
      activities: [
        { time: "09:00", place: `${destination} City Center`, description: "Morning city exploration and iconic landmarks.", estimatedCost: 20 },
        { time: "13:00", place: "Local Diner", description: "Taste local regional cuisine.", estimatedCost: 15 },
        { time: "16:00", place: "Popular Attraction", description: "Guided tour and photo spots.", estimatedCost: 25 },
        { time: "20:00", place: "Waterfront Evening", description: "Relaxing evening walk and dinner.", estimatedCost: 30 },
      ],
    });
  }

  return {
    destination,
    summary: `Structured ${d}-day ${travelStyle} trip to ${destination} for ${travelers} traveler(s).`,
    days: dayList,
    estimatedBudget: {
      transport,
      accommodation,
      food,
      activities,
      miscellaneous,
      total: transport + accommodation + food + activities + miscellaneous,
    },
    tips: [
      `Check regional travel guidelines for ${destination}.`,
      "Keep local currency or cards handy for small transactions.",
      "Reserve entry passes early during peak travel seasons.",
    ],
  };
}
