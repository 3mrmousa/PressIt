import type { Request, Response } from "express";
import type { AuthRequest } from "../../types/authRequest.type.js";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import AppError from "../../utils/errors/AppError.js";
import {
  createManagerService,
  deleteManagerService,
  getAdminSettingsService,
  updateAdminSettingsService,
  getSystemLogsService,
  getAllUsersService,
  getUserByIdService,
} from "./admin.service.js";
import FakeSubscription from "../fake-subscription/fake-subscription.model.js";
import User from "../user/user.model.js";

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

export const getAdminStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }

    const { page = 1 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = 10;
    const skip = (pageNumber - 1) * limitNumber;

    const aggregationResult = await FakeSubscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
    ]);
    const totalEarnings = aggregationResult[0]?.totalEarnings || 0;

    const subscriptions = await FakeSubscription.find()
      .populate("user", "_id firstName lastName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNumber)
      .lean();

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalActiveSubscriptions: await FakeSubscription.countDocuments({
          status: "active",
        }).lean(),
        totalCanceledSubscriptions: await FakeSubscription.countDocuments({
          status: "canceled",
        }).lean(),
        totalManagers: await User.countDocuments({ role: "manager" }).lean(),
        totalUsers: await User.countDocuments({ role: "user" }).lean(),
        totalFreeUsers: await User.countDocuments({
          role: "user",
          plan: "free",
        }).lean(),
        totalPlusUsers: await User.countDocuments({
          role: "user",
          plan: "plus",
        }).lean(),
        totalProUsers: await User.countDocuments({
          role: "user",
          plan: "pro",
        }).lean(),
        subscriptions,
      },
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(
          (await FakeSubscription.countDocuments({
            status: "active",
          })) / limitNumber,
        ),
      },
    });
  },
);

export const getAdminSettings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }
    const settings = await getAdminSettingsService();
    res.json({
      success: true,
      data: settings,
    });
  },
);

export const updateAdminSettings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }
    const {
      siteName,
      subscriptionPrices: { plus, pro },
    } = req.body;
    const logo = req.file?.buffer;
    if (!siteName || !plus || !pro || !logo) {
      throw new AppError("at least one of the fields are required", 400);
    }

    const settings = await updateAdminSettingsService(
      siteName,
      plus,
      pro,
      logo,
    );
    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  },
);

export const getSystemLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const { logs, totalLogs } = await getSystemLogsService(page, limit);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
      },
    });
  },
);

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
