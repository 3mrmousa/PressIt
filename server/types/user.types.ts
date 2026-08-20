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
  profilePicture?: {
    secure_url: string;
    public_id: string;
  };
  history: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
}
