import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  favoriteCats: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
