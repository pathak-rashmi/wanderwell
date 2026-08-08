import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { Bookmark } from "../models/Bookmark.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { Expense } from "../models/Expense.js";
import { Itinerary } from "../models/Itinerary.js";
import { TravelGroup } from "../models/TravelGroup.js";
import { Trip } from "../models/Trip.js";

const objectId = z.string().refine(isValidObjectId, "Invalid id");
const tripId = z.object({ tripId: objectId });

async function ownedTrip(request: Request, requestedTripId: string) {
  return Trip.findOne({ _id: requestedTripId, userId: request.user.id });
}

function invalid(response: Response, error: z.ZodError) {
  return response.status(400).json({
    message: "Validation failed",
    errors: error.flatten().fieldErrors,
  });
}

const bookmarkSchema = z.object({
  destinationId: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  country: z.string().trim().optional(),
  image: z.string().url().optional(),
});

export async function createBookmark(request: Request, response: Response) {
  const parsed = bookmarkSchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);
  const exists = await Bookmark.exists({ userId: request.user.id, destinationId: parsed.data.destinationId });
  if (exists) return response.status(409).json({ message: "Destination already bookmarked" });

  const bookmark = await Bookmark.create({ ...parsed.data, userId: request.user.id });
  return response.status(201).json(bookmark);
}

export async function getBookmarks(request: Request, response: Response) {
  const bookmarks = await Bookmark.find({ userId: request.user.id }).sort({ createdAt: -1 });
  return response.json(bookmarks);
}

const itinerarySchema = tripId.extend({
  day: z.string().trim().min(1),
  time: z.string().trim().min(1),
  title: z.string().trim().min(1),
  kind: z.string().trim().min(1),
});

export async function createItinerary(request: Request, response: Response) {
  const parsed = itinerarySchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);
  if (!(await ownedTrip(request, parsed.data.tripId))) return response.status(404).json({ message: "Trip not found" });

  const entry = await Itinerary.create({ ...parsed.data, userId: request.user.id });
  return response.status(201).json(entry);
}

const expenseSchema = tripId.extend({
  category: z.string().trim().min(1),
  amount: z.coerce.number().finite().min(0),
  description: z.string().trim().optional(),
  currency: z.string().trim().length(3).default("USD"),
});

export async function createExpense(request: Request, response: Response) {
  const parsed = expenseSchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);
  if (!(await ownedTrip(request, parsed.data.tripId))) return response.status(404).json({ message: "Trip not found" });

  const expense = await Expense.create({ ...parsed.data, userId: request.user.id });
  return response.status(201).json(expense);
}

const groupSchema = tripId.extend({
  name: z.string().trim().min(1),
  members: z.array(z.string().trim().min(1)).default([]),
});

export async function createGroup(request: Request, response: Response) {
  const parsed = groupSchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);
  if (!(await ownedTrip(request, parsed.data.tripId))) return response.status(404).json({ message: "Trip not found" });

  const group = await TravelGroup.create({ ...parsed.data, userId: request.user.id });
  return response.status(201).json(group);
}

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  tripId: objectId.optional(),
});

export async function createChatMessage(request: Request, response: Response) {
  const parsed = chatSchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);
  if (parsed.data.tripId && !(await ownedTrip(request, parsed.data.tripId))) {
    return response.status(404).json({ message: "Trip not found" });
  }

  const reply = "I can help organize destinations, timing, packing, and budgets for your trip.";
  const message = await ChatMessage.create({
    ...parsed.data,
    userId: request.user.id,
    response: reply,
  });
  return response.status(201).json(message);
}

const weatherSchema = z
  .object({
    destination: z.string().trim().min(1).optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  })
  .refine(
    (weather) => weather.destination || (weather.latitude !== undefined && weather.longitude !== undefined),
    "Provide destination or latitude and longitude",
  );

export async function getWeather(request: Request, response: Response) {
  const parsed = weatherSchema.safeParse(request.body);
  if (!parsed.success) return invalid(response, parsed.error);

  let latitude = parsed.data.latitude;
  let longitude = parsed.data.longitude;
  let location = parsed.data.destination ?? "Coordinates";

  if (parsed.data.destination) {
    const geocodeResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(parsed.data.destination)}&count=1&language=en&format=json`,
    );
    const geocode = (await geocodeResponse.json()) as { results?: Array<{ latitude: number; longitude: number; name: string; country: string }> };
    const result = geocode.results?.[0];
    if (!result) return response.status(404).json({ message: "Destination not found" });
    latitude = result.latitude;
    longitude = result.longitude;
    location = `${result.name}, ${result.country}`;
  }

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&timezone=auto`,
  );
  if (!weatherResponse.ok) return response.status(502).json({ message: "Weather provider unavailable" });
  const forecast = await weatherResponse.json();
  return response.json({ location, latitude, longitude, forecast });
}