import { Document, Types } from "mongoose";


export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  role: "user" | "manager" | "admin";
  plan: "free" | "plus" | "pro";
  profilePicture: string | null;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
}
