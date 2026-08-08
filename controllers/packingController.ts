import type { Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { PackingItem } from "../models/PackingItem.js";
import { Trip } from "../models/Trip.js";

const objectIdSchema = z.string().refine(isValidObjectId, "Invalid id");

const packingInputSchema = z.object({
  tripId: objectIdSchema,
  item: z.string().trim().min(1),
  completed: z.boolean().default(false),
});

const packingUpdateSchema = z
  .object({
    item: z.string().trim().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (packingItem) => Object.keys(packingItem).length > 0,
    "At least one field is required",
  );

function validationError(response: Response, error: z.ZodError) {
  return response.status(400).json({
    message: "Validation failed",
    errors: error.flatten().fieldErrors,
  });
}

function getItemId(request: AuthenticatedRequest, response: Response) {
  const itemId = objectIdSchema.safeParse(request.params.id);
  if (!itemId.success) {
    response.status(400).json({ message: "Invalid packing item id" });
    return null;
  }

  return itemId.data;
}

async function getOwnedTrip(tripId: string, userId: string) {
  return Trip.findOne({ _id: tripId, userId });
}

export async function createPackingItem(request: AuthenticatedRequest, response: Response) {
  const parsed = packingInputSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, parsed.error);
  if (!(await getOwnedTrip(parsed.data.tripId, request.user.id))) {
    return response.status(404).json({ message: "Trip not found" });
  }

  const packingItem = await PackingItem.create(parsed.data);
  return response.status(201).json(packingItem);
}

export async function getPackingItems(request: AuthenticatedRequest, response: Response) {
  const tripId = objectIdSchema.safeParse(request.query.tripId);
  if (!tripId.success) {
    return response.status(400).json({ message: "A valid tripId query is required" });
  }
  if (!(await getOwnedTrip(tripId.data, request.user.id))) {
    return response.status(404).json({ message: "Trip not found" });
  }

  const packingItems = await PackingItem.find({ tripId: tripId.data }).sort({ createdAt: 1 });
  return response.json(packingItems);
}

export async function getPackingItem(request: AuthenticatedRequest, response: Response) {
  const itemId = getItemId(request, response);
  if (!itemId) return;

  const packingItem = await PackingItem.findById(itemId);
  if (!packingItem) return response.status(404).json({ message: "Packing item not found" });
  if (!(await getOwnedTrip(packingItem.tripId.toString(), request.user.id))) {
    return response.status(404).json({ message: "Packing item not found" });
  }

  return response.json(packingItem);
}

export async function updatePackingItem(request: AuthenticatedRequest, response: Response) {
  const itemId = getItemId(request, response);
  const parsed = packingUpdateSchema.safeParse(request.body);
  if (!itemId) return;
  if (!parsed.success) return validationError(response, parsed.error);

  const packingItem = await PackingItem.findById(itemId);
  if (!packingItem) return response.status(404).json({ message: "Packing item not found" });
  if (!(await getOwnedTrip(packingItem.tripId.toString(), request.user.id))) {
    return response.status(404).json({ message: "Packing item not found" });
  }

  Object.assign(packingItem, parsed.data);
  await packingItem.save();
  return response.json(packingItem);
}

export async function deletePackingItem(request: AuthenticatedRequest, response: Response) {
  const itemId = getItemId(request, response);
  if (!itemId) return;

  const packingItem = await PackingItem.findById(itemId);
  if (!packingItem) return response.status(404).json({ message: "Packing item not found" });
  if (!(await getOwnedTrip(packingItem.tripId.toString(), request.user.id))) {
    return response.status(404).json({ message: "Packing item not found" });
  }

  await packingItem.deleteOne();
  return response.status(204).send();
}