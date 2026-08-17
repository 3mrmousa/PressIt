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
    const tier = user?.plan || (user ? "free" : "guest");

    const today = new Date().toISOString().split("T")[0];

    const key = `compress:${tier}:${id}:${today}`;

    const limit = LIMITS[tier] ?? LIMITS.guest;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60 * 60 * 24);
    }

    if (count > limit) {
      throw new AppError("Daily limit reached", 429);
    }

    next();
  },
);
