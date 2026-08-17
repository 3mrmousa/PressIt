import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const url = process.env.MONGODB_URL;

  if (!url) {
    throw new Error("Missing MONGODB_URL");
  }

  await mongoose.connect(url);
  console.log("MongoDB connected");
}
