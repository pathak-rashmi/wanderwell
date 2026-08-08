import { Schema, model } from "mongoose";

const itinerarySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    day: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    kind: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Itinerary = model("Itinerary", itinerarySchema);