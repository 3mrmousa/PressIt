import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/authRequest.type.js";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import AppError from "../../utils/errors/AppError.js";
import {
  loginUserService,
  getMeService,
  createManagerService,
  deleteManagerService,
} from "./auth.service.js";
import generateToken from "../../utils/generateToken.js";
import User from "../user/user.model.js";
import { generateEmailVerificationOTP } from "../../utils/email-verification.service.js";
import {
  sendForgotPasswordOTP,
  sendRegisterOTPEmail,
} from "../../utils/email.service.js";
import { delOtpSession, getOtpSession, setOtpSession } from "../../utils/otp.redis.js";
import {
  OtpForgotPasswordType,
  OtpVerificationEmailType,
} from "./services/otp.store.verification.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new AppError("User already exists", 400);
    }

    const { otp, hashedOtp } = generateEmailVerificationOTP();

    const existingSession = await getOtpSession<OtpVerificationEmailType>(
      `verify-email:${req.ip?.toString()}`,
    );

    if (existingSession) {
      throw new AppError(
        "OTP already sent. Please verify or wait for expiration.",
        400,
      );
    }

    await setOtpSession(
      `verify-email:${req.ip?.toString()}`,
      {
        otpHash: hashedOtp,
        userData: {
          email,
          password,
          firstName,
          lastName,
        },
      },
      600,
    );

    await sendRegisterOTPEmail(email, otp);

    res.status(200).json({
      success: "success",
      message: "OTP sent to email. Please verify to continue registration.",
    });
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const user = await loginUserService(email, password);

  if (!user.emailVerified) {
    throw new AppError(
      "Email not verified. Please verify your email to login.",
      403,
    );
  }

  generateToken(res, user._id);
  res.status(200).json({
    success: "success",
    data: user,
  });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    success: "success",
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const user = await getMeService(req.user._id.toString());

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const createManager = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw new AppError("All fields are required", 400);
    }

    const user = await createManagerService(
      email,
      password,
      firstName,
      lastName,
    );

    res.status(201).json({
      success: "success",
      message: `Manager created successfully ${user.firstName} ${user.lastName}`,
    });
  },
);

export const deleteManager = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedUser = await deleteManagerService(id.toString());
    res.status(200).json({
      success: "success",
      message: `Deleted manager ${deletedUser.firstName} ${deletedUser.lastName}`,
    });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.emailVerified) {
      return res.status(200).json({
        success: "success",
        message:
          "If this email is registered, you will receive an OTP shortly.",
      });
    }

    if (!user.emailVerified) {
      throw new AppError(
        "Email not verified. Please verify your email to login.",
        403,
      );
    }

    const { otp, hashedOtp } = generateEmailVerificationOTP();

    const existingSession = await getOtpSession<OtpForgotPasswordType>(
      `forgot-password:${email}`,
    );

    if (existingSession) {
      throw new AppError(
        "OTP already sent. Please verify or wait for expiration.",
        400,
      );
    }

    await setOtpSession(
      `forgot-password:${email}`,
      {
        email,
        otpHash: hashedOtp,
        verified: false,
      },
      600,
    );

    await sendForgotPasswordOTP(email, otp);

    res.status(200).json({
      success: "success",
      message: "OTP sent to email. Please verify to continue registration.",
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    const session = await getOtpSession<OtpForgotPasswordType>(
      `forgot-password:${email}`,
    );

    if (!session) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!session.verified) {
      throw new AppError("OTP not verified. Please verify first", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.password = newPassword;
    await user.save();

    await delOtpSession(`forgot-password:${email}`);

    res.status(200).json({
      success: "success",
      message: "Password reset successfully",
    });
  },
);
