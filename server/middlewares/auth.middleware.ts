import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest.type.js";
import AppError from "../utils/errors/AppError.js";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import asyncHandler from "../utils/errors/asyncHandler.js";

interface JWTPayload {
  userId: string;
}

export const Protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new AppError("Not Authorized", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("JWT secret not found", 500);
    }

    const decode = jwt.verify(token, secret) as JWTPayload;
    if (!decode?.userId) {
      throw new AppError("Not Authorized", 401);
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    return next();
  },
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not Authorized", 401));
    }
    const role = req.user.role;
    if (!roles.includes(role)) {
      return next(new AppError("Not Authorized to perform this action", 403));
    }

    next();
  };
};

export const optionalProtect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if (!token) return next();

    const secret = process.env.JWT_SECRET;
    if (!secret) return next();

    try {
      const decode = jwt.verify(token, secret) as JWTPayload;
      const user = await User.findById(decode.userId).select("-password");
      if (user) req.user = user;
    } catch (error) {}
    return next();
  },
);
