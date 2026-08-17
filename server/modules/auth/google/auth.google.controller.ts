import asyncHandler from "../../../utils/errors/asyncHandler.js";
import User from "../../user/user.model.js";
import generateToken from "../../../utils/generateToken.js";
import { verifyGoogleToken } from "./auth.google.service.js";
import AppError from "../../../utils/errors/AppError.js";

export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== "string") {
    throw new AppError("Google token is required", 400);
  }
  const googleUser = await verifyGoogleToken(token);

  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    const crypto = await import("crypto");
    const randomPassword = crypto.randomBytes(16).toString("hex");
    user = await User.create({
      email: googleUser.email,
      firstName: googleUser.firstName || "Google",
      lastName: googleUser.lastName || "User",
      password: randomPassword, // generate random password to satisfy schema
      emailVerified: true,
      role: "user",
    });
  }

  generateToken(res, user._id);

  res.json({
    success: true,
    data: user,
  });
});
