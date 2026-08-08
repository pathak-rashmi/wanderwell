import { Schema, model, type InferSchemaType } from "mongoose";

const tripSchema = new Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export type TripDocument = InferSchemaType<typeof tripSchema>;
export const Trip = model("Trip", tripSchema);