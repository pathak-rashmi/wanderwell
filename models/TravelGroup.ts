import { Schema, model } from "mongoose";

const travelGroupSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    name: { type: String, required: true, trim: true },
    members: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const TravelGroup = model("TravelGroup", travelGroupSchema);