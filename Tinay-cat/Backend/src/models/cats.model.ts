import mongoose from "mongoose";
import type { ICat } from "../types/cats.types.ts";

const catSchema = new mongoose.Schema<ICat>(
  {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lifespan: {
      type: Number,
      default: 1,
    },
    energyLevel: {
      type: String,
      required: true,
    },
    kidsFriendly: {
      type: Boolean,
      default: true,
    },
    apartmentFriendly: {
      type: Boolean,
      default: true,
    },
    image: String,
    color: String,
  },
  {
    timestamps: true,
  }
);

const catModel = mongoose.model<ICat>("Cat", catSchema);

export default catModel;