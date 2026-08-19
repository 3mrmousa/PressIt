import type { Request, Response } from "express";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import {
  getAllUsersService,
  getUserByIdService,
  updatePasswordService,
  deleteUserService,
  updateUserProfileService,
} from "./user.service.js";
import AppError from "../../utils/errors/AppError.js";
import type { AuthRequest } from "../../types/authRequest.type.js";
import User from "./user.model.js";
import { generateEmailVerificationOTP } from "../../utils/email-verification.service.js";
import { sendCurrentEmailChangeOTP } from "../../utils/email.service.js";
import { uploadProfilePictureToCloudinary } from "../../utils/uploadToCloudinary.js";
import { getOtpSession, setOtpSession } from "../../utils/otp.redis.js";
import { ChangeEmailOtpSession } from "./service/otp.store.changeEmail.js";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const users = await getAllUsersService(page, limit);

  res.status(200).json({
    success: "success",
    data: users,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!userId) {
    throw new AppError("User ID not found", 400);
  }

  const user = await getUserByIdService(userId.toString());

  res.status(200).json({
    success: "success",
    data: user,
  });
});

export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName } = req.body;
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const userId = req.user._id.toString();

    if (!firstName || !lastName) {
      throw new AppError("First name and last name are required", 400);
    }

    const updatedUser = await updateUserProfileService(
      userId,
      firstName,
      lastName,
    );

    res.status(200).json({
      success: "success",
      data: updatedUser,
    });
  },
);

export const updatePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const userId = req.user._id;

    if (!userId) {
      throw new AppError("You are not authorized to update this profile", 403);
    }

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    const updatedUser = await updatePasswordService(
      userId.toString(),
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      success: "success",
      data: updatedUser,
    });
  },
);

export const updateEmail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { newEmail } = req.body;
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const userId = req.user._id;

    if (!userId) {
      throw new AppError("You are not authorized to update this profile", 403);
    }

    if (!newEmail) {
      throw new AppError("New email (newEmail) is required", 400);
    }

    if (req.user.email === newEmail) {
      throw new AppError(
        "You cannot change your email to your current email",
        400,
      );
    }

    const existingUser = await User.findOne({ email: newEmail });

    if (existingUser) {
      throw new AppError("Email is already taken", 400);
    }

    const { otp, hashedOtp } = generateEmailVerificationOTP();

    const existingSession = await getOtpSession<ChangeEmailOtpSession>(
      `change-email:${userId.toString()}`,
    );

    if (existingSession) {
      throw new AppError(
        "OTP already sent. Please verify or wait for expiration.",
        400,
      );
    }

    await setOtpSession(
      `change-email:${userId.toString()}`,
      {
        userId: userId.toString(),
        newEmail: newEmail,
        step1Verified: false,
        otpCurrentEmailHash: hashedOtp,
        otpNewEmailHash: null,
      },
      600,
    );

    await sendCurrentEmailChangeOTP(req.user.email, otp);

    res.status(200).json({
      success: "success",
      message: "OTP sent to your email, please verify it within 10 minutes",
    });
  },
);

export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const userId = req.user._id;

    if (!userId) {
      throw new AppError("You are not authorized to delete this profile", 403);
    }

    const message = await deleteUserService(userId.toString());

    res.status(200).json({
      success: "success",
      message,
    });
  },
);

export const uploadProfilePicture = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AppError("Not authorized", 401);
    if (!req.file) throw new AppError("No file uploaded", 400);

    const imageUrl = await uploadProfilePictureToCloudinary(req.file.buffer);

    const user = await User.findById(req.user._id);

    if (!user) throw new AppError("User not found", 404);

    user.profilePicture = imageUrl;
    await user.save();

    res.json({
      success: true,
      data: {
        profilePicture: user.profilePicture,
      },
    });
  },
);

export const toggleHistory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user.history = !user.history;
    await user.save();
    res.json({
      success: true,
      data: {
        history: user.history,
      },
    });
  },
);
