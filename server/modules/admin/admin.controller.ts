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
  deleteAllSystemLogsService,
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  getAllManagersService,
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

export const getAllManagers = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const data = await getAllManagersService(page, limit);

  res.status(200).json({
    success: "success",
    data: data,
    pagination: {
      Pages: Math.ceil(data.total / limit),
      page,
      limit,
    },
  });
});



export const getAdminStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [
      aggregationResult,
      subscriptions,
      totalActiveSubscriptions,
      totalCanceledSubscriptions,
      totalManagers,
      totalUsers,
      totalFreeUsers,
      totalPlusUsers,
      totalProUsers,
      totalSubscriptionsCount
    ] = await Promise.all([
      FakeSubscription.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
      ]),
      FakeSubscription.find()
        .populate("user", "_id firstName lastName email")
        .sort("-createdAt")
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      FakeSubscription.countDocuments({ status: "active" }).lean(),
      FakeSubscription.countDocuments({ status: "canceled" }).lean(),
      User.countDocuments({ role: "manager" }).lean(),
      User.countDocuments({ role: "user" }).lean(),
      User.countDocuments({ role: "user", plan: "free" }).lean(),
      User.countDocuments({ role: "user", plan: "plus" }).lean(),
      User.countDocuments({ role: "user", plan: "pro" }).lean(),
      FakeSubscription.countDocuments({ status: "active" })
    ]);

    const totalEarnings = aggregationResult[0]?.totalEarnings || 0;

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalActiveSubscriptions,
        totalCanceledSubscriptions,
        totalManagers,
        totalUsers,
        totalFreeUsers,
        totalPlusUsers,
        totalProUsers,
        subscriptions,
      },
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalSubscriptionsCount / limitNumber),
      },
    });
  },
);



export const getAdminSettings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
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
    
    const { siteName, plusPrice, proPrice } = req.body;
    
    const plus = plusPrice !== undefined ? Number(plusPrice) : undefined;
    const pro = proPrice !== undefined ? Number(proPrice) : undefined;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const logo = files?.['logo']?.[0]?.buffer;
    const favicon = files?.['favicon']?.[0]?.buffer;
    
    if (!siteName && plus === undefined && pro === undefined && !logo && !favicon) {
      throw new AppError("At least one of the fields is required", 400);
    }

    const settings = await updateAdminSettingsService(
      siteName,
      plus,
      pro,
      logo,
      favicon
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

export const deleteAllSystemLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }
    await deleteAllSystemLogsService();
    res.json({
      success: true,
      message: "Logs deleted successfully",
    });
  },
);



export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
      throw new AppError("You are not allowed to perform this action", 403);
    }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const data = await getAllUsersService(page, limit);

  res.status(200).json({
    success: "success",
    data: data,
    pagination: {
      Pages: Math.ceil(data.total / limit),
      page,
      limit,
    },
  });
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "admin" && req.user?.role !== "manager") {
    throw new AppError("You are not allowed to perform this action", 403);
  }
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

export const deleteUser = asyncHandler(async(req:AuthRequest,res:Response)=>{
  if (req.user?.role !== "admin" && req.user?.role !== "manager") {
    throw new AppError("You are not allowed to perform this action", 403);
  }
  const userId = req.params.id;
  if (!userId) {
    throw new AppError("User ID not found", 400);
  }
  const data = await deleteUserService(userId.toString());
  res.status(200).json({
    success: "success",
    message: `Deleted user ${data.firstName} ${data.lastName}`,
  });
});