import { Schema, model } from "mongoose";

const bookmarkSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    destinationId: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true },
);

bookmarkSchema.index({ userId: 1, destinationId: 1 }, { unique: true });
export const Bookmark = model("Bookmark", bookmarkSchema);