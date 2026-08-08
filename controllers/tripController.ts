import type { Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { PackingItem } from "../models/PackingItem.js";
import { Trip } from "../models/Trip.js";

const tripIdSchema = z.string().refine(isValidObjectId, "Invalid trip id");

const tripFieldsSchema = z.object({
  destination: z.string().trim().min(1),
  budget: z.coerce.number().finite().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

const tripInputSchema = tripFieldsSchema
  .refine((trip) => trip.endDate >= trip.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

const tripUpdateSchema = tripFieldsSchema
  .partial()
  .refine((trip) => Object.keys(trip).length > 0, "At least one field is required");

function validationError(response: Response, error: z.ZodError) {
  return response.status(400).json({
    message: "Validation failed",
    errors: error.flatten().fieldErrors,
  });
}

function getTripId(request: AuthenticatedRequest, response: Response) {
  const tripId = tripIdSchema.safeParse(request.params.id);
  if (!tripId.success) {
    response.status(400).json({ message: "Invalid trip id" });
    return null;
  }

  return tripId.data;
}

export async function createTrip(request: AuthenticatedRequest, response: Response) {
  const parsed = tripInputSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, parsed.error);

  const trip = await Trip.create({ ...parsed.data, userId: request.user.id });
  return response.status(201).json(trip);
}

export async function getTrips(request: AuthenticatedRequest, response: Response) {
  const trips = await Trip.find({ userId: request.user.id }).sort({ startDate: 1 });
  return response.json(trips);
}

export async function getTrip(request: AuthenticatedRequest, response: Response) {
  const tripId = getTripId(request, response);
  if (!tripId) return;

  const trip = await Trip.findOne({ _id: tripId, userId: request.user.id });
  if (!trip) return response.status(404).json({ message: "Trip not found" });
  return response.json(trip);
}

export async function updateTrip(request: AuthenticatedRequest, response: Response) {
  const tripId = getTripId(request, response);
  const parsed = tripUpdateSchema.safeParse(request.body);
  if (!tripId) return;
  if (!parsed.success) return validationError(response, parsed.error);

  const currentTrip = await Trip.findOne({ _id: tripId, userId: request.user.id });
  if (!currentTrip) return response.status(404).json({ message: "Trip not found" });

  const nextStartDate = parsed.data.startDate ?? currentTrip.startDate;
  const nextEndDate = parsed.data.endDate ?? currentTrip.endDate;
  if (nextEndDate < nextStartDate) {
    return response.status(400).json({ message: "endDate must be on or after startDate" });
  }

  Object.assign(currentTrip, parsed.data);
  await currentTrip.save();
  return response.json(currentTrip);
}

export async function deleteTrip(request: AuthenticatedRequest, response: Response) {
  const tripId = getTripId(request, response);
  if (!tripId) return;

  const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, userId: request.user.id });
  if (!deletedTrip) return response.status(404).json({ message: "Trip not found" });
  await PackingItem.deleteMany({ tripId: deletedTrip._id });
  return response.status(204).send();
}