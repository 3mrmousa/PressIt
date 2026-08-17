import type { AuthRequest } from "../../types/authRequest.type.js";
import AppError from "../../utils/errors/AppError.js";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import type { Response } from "express";
import { generateEmailVerificationOTP } from "../../utils/email-verification.service.js";
import crypto from "crypto";
import { updateEmailService } from "./user.service.js";
import { sendNewEmailVerificationOTP } from "../../utils/email.service.js";
import {
  setOtpSession,
  getOtpSession,
  delOtpSession,
} from "../../utils/otp.redis.js";
import { ChangeEmailOtpSession } from "./service/otp.store.changeEmail.js";

export const verifyCurrentEmailOTP = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { otp } = req.body;

    if (!otp) {
      throw new AppError("OTP is required", 400);
    }

    const userId = req.user?._id.toString();

    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const session = await getOtpSession<ChangeEmailOtpSession>(
      `change-email:${userId}`,
    );

    if (!session) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!session.newEmail) {
      throw new AppError("Invalid session state", 400);
    }

    const hashed = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashed !== session.otpCurrentEmailHash) {
      throw new AppError("Invalid OTP", 400);
    }

    const newOtp = generateEmailVerificationOTP();

    await setOtpSession(
      `change-email:${userId.toString()}`,
      {
        ...session,
        step1Verified: true,
        otpNewEmailHash: newOtp.hashedOtp,
      },
      600,
    );

    await sendNewEmailVerificationOTP(session.newEmail, newOtp.otp);

    res.status(200).json({
      success: "success",
      message: "OTP verified successfully, now verify your new email",
    });
  },
);

export const verifyNewEmailOTP = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { otp } = req.body;

    if (!otp) {
      throw new AppError("OTP is required", 400);
    }

    const userId = req.user?._id.toString();

    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const session = await getOtpSession<ChangeEmailOtpSession>(
      `change-email:${userId}`,
    );

    if (!session) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!session.step1Verified) {
      throw new AppError("Please verify your current email first", 400);
    }

    const hashed = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashed !== session.otpNewEmailHash) {
      throw new AppError("Invalid OTP", 400);
    }

    await updateEmailService(userId.toString(), session.newEmail);

    await delOtpSession(`change-email:${userId}`);

    res.status(200).json({
      success: "success",
      message: "Email changed successfully",
    });
  },
);
