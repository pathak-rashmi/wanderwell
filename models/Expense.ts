import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    currency: { type: String, trim: true, uppercase: true, default: "USD" },
  },
  { timestamps: true },
);

export const Expense = model("Expense", expenseSchema);