import { Schema, model } from "mongoose";

const chatMessageSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip" },
    message: { type: String, required: true, trim: true },
    response: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const ChatMessage = model("ChatMessage", chatMessageSchema);