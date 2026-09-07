import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/authRequest.type.js";
import asyncHandler from "../utils/errors/asyncHandler.js";
import redis from "../config/redis.js";
import { LIMITS } from "../config/limits.js";
import AppError from "../utils/errors/AppError.js";

export const checkCompressionLimit = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const ip = req.ip;

    const id = user?._id?.toString() || ip;
    let tier = "guest";
    if (user) {
      if (user.role === "admin" || user.role === "manager") {
        tier = user.role;
      } else {
        tier = user.plan || "free";
      }
    }

    const today = new Date().toISOString().split("T")[0];

    const key = `compress:${tier}:${id}:${today}`;

    const limit = LIMITS[tier] ?? LIMITS.guest;

    const currentCountStr = await redis.get(key);
    const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;

    if (currentCount >= limit) {
      throw new AppError("Daily limit reached", 429);
    }

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60 * 60 * 24);
    }

    next();
  },
);
