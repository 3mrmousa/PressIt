import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/errors/AppError.js";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["http://localhost:3001", "http://localhost:3002"];

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (["POST", "PUT", "PATCH", "DELETE", "GET"].includes(req.method)) {
    const origin = req.headers.origin;

    if (origin && !allowedOrigins.includes(origin)) {
      return next(new AppError("CSRF: origin not allowed", 403));
    }
  }
  next();
};
