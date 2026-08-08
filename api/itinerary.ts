import type { Request, Response } from "express";
import { generateItinerary } from "../src/services/itineraryService";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const {
    destination = "Goa",
    days = 3,
    budget = 1000,
    travelers = 1,
    travelStyle = "Adventure",
    interests = [],
  } = req.body || {};

  try {
    const itinerary = await generateItinerary({
      destination,
      days: Number(days),
      budget: Number(budget),
      travelers: Number(travelers),
      travelStyle,
      interests,
    });

    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Itinerary endpoint error:", error);
    return res.status(500).json({ error: "Failed to generate itinerary" });
  }
}
