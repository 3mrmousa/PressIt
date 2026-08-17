import crypto from "crypto";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import type { Request, Response } from "express";

import AppError from "../../utils/errors/AppError.js";
import User from "../user/user.model.js";
import generateToken from "../../utils/generateToken.js";
import {
  delOtpSession,
  getOtpSession,
  setOtpSession,
} from "../../utils/otp.redis.js";
import {
  OtpForgotPasswordType,
  OtpVerificationEmailType,
} from "./services/otp.store.verification.js";

export const verifyRegisterOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp } = req.body;

    const session = await getOtpSession<OtpVerificationEmailType>(
      `verify-email:${req.ip?.toString()}`,
    );
    if (!session) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!session.otpHash) {
      throw new AppError("Invalid session state", 400);
    }

    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedInput !== session.otpHash) {
      throw new AppError("Invalid OTP", 400);
    }

    const user = await User.create({
      ...session.userData,
      emailVerified: true,
    });

    await delOtpSession(`verify-email:${req.ip?.toString()}`);

    generateToken(res, user._id);

    res.status(201).json({
      success: "success",
      message: "User created successfully",
    });
  },
);

export const verifyForgotPasswordOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const session = await getOtpSession<OtpForgotPasswordType>(
      `forgot-password:${email}`,
    );
    if (!session) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!session.otpHash) {
      throw new AppError("Invalid session state", 400);
    }

    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedInput !== session.otpHash) {
      throw new AppError("Invalid OTP", 400);
    }

    await setOtpSession(
      `forgot-password:${email}`,
      {
        ...session,
        verified: true,
      },
      600,
    );

    res.status(200).json({
      success: "success",
      message: "OTP verified successfully",
    });
  },
);
