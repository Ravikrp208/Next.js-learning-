import mongoose from "mongoose";
import type { IUser } from "../types/user.types.ts";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    favoriteCats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
