import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import AppError from "./errors/AppError.js";

const generateToken = (res: Response, userId: Types.ObjectId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT Secret is not defined", 500);
  }

  const token = jwt.sign({ userId: userId.toString() }, secret, {
    expiresIn: "7d",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
