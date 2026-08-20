import AppError from "../../utils/errors/AppError.js";
import User from "../user/user.model.js";
import redis from "../../config/redis.js";
import { LIMITS } from "../../config/limits.js";

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return user;
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let tier = "free";
  if (user.role === "admin" || user.role === "manager") {
    tier = user.role;
  } else {
    tier = user.plan || "free";
  }
  const limit = LIMITS[tier] ?? LIMITS.guest;
  const today = new Date().toISOString().split("T")[0];
  const key = `compress:${tier}:${userId}:${today}`;

  const countStr = await redis.get(key);
  const count = countStr ? parseInt(countStr, 10) : 0;

  return { ...user, usage: { count, limit } };
};
