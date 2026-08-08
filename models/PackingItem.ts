import { Schema, model, type InferSchemaType } from "mongoose";

const packingItemSchema = new Schema(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    item: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

export type PackingItemDocument = InferSchemaType<typeof packingItemSchema>;
export const PackingItem = model("PackingItem", packingItemSchema);