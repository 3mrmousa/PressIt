import asyncHandler from "../../utils/errors/asyncHandler.js";
import type { Response } from "express";
import AppError from "../../utils/errors/AppError.js";
import type { AuthRequest } from "../../types/authRequest.type.js";
import {
  compressImageService,
  deleteImageService,
  getHistoryService,
  getImageByIdService,
} from "./compress.service.js";

export const compressImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new AppError("No file uploaded", 400);
    }

    const rawPercent = req.body.percent;
    const percent = rawPercent !== undefined ? Number(rawPercent) : 100;

    if (isNaN(percent) || percent < 1 || percent > 99) {
      throw new AppError("percent must be between 1 and 99", 400);
    }
    const record = await compressImageService(file, percent, req.user?._id || null, req.user?.history || false);

    res.json({
      success: true,
      data: record,
    });
  },
);

export const getHistory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const history = await getHistoryService(userId.toString(), page, limit);

    res.json({
      success: true,
      data: history,
    });
  },
);


export const getImageById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const image = await getImageByIdService(
      req.params.id.toString(),
      userId.toString(),
    );

    res.json({
      success: true,
      data: image,
    });
  },
);

export const deleteImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await deleteImageService(userId.toString(), req.params.id.toString());

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  },
);
