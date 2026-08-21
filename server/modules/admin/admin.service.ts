import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";
import AppError from "../../utils/errors/AppError.js";
import { uploadLogoToCloudinary } from "../../utils/uploadToCloudinary.js";
import User from "../user/user.model.js";
import AdminSettings from "./admin.model.js";
import SystemLog from "./log.model.js";

export const createManagerService = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new AppError("User already exists", 400);
  }

  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: "manager",
    emailVerified: true,
  });

  return newUser;
};

export const getAllManagersService = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [managers, total] =
    await Promise.all([
      User.find({role: "manager"}).select("-__v -password").skip(skip).limit(limit).lean(),
      User.countDocuments({ role: "manager" }),
    ]);

  return {
    managers,
    total
  };
};

export const deleteManagerService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "manager") {
    throw new AppError("This user is not a manager", 400);
  }

  await user.deleteOne();

  return user;
};

export const getAdminSettingsService = async () => {
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({});
  }
  return settings;
};

export const updateAdminSettingsService = async (
  siteName: string,
  plus: number,
  pro: number,
  logo: Buffer,
) => {
  let settings = await AdminSettings.findOne();
  const { secure_url, public_id } = await uploadLogoToCloudinary(logo);
  if (!settings) {
    settings = await AdminSettings.create({
      siteName,
      subscriptionPrices: { plus, pro },
      logo: { secure_url, public_id },
    });
  } else {
    if (siteName !== undefined) settings.siteName = siteName;
    if (logo !== undefined) {
      if (settings.logo?.public_id) {
        await deleteFromCloudinary(settings.logo?.public_id);
      }
      settings.logo = { secure_url, public_id };
    }
    if (plus !== undefined) {
      settings.subscriptionPrices.plus = plus;
    }
    if (pro !== undefined) {
      settings.subscriptionPrices.pro = pro;
    }
    await settings.save();
  }
  return settings;
};

export const getSystemLogsService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const logs = await SystemLog.find()
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const totalLogs = await SystemLog.countDocuments();

  return { logs, totalLogs };
};

export const getAllUsersService = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] =
    await Promise.all([
      User.find({role: "user"}).select("-__v -password").skip(skip).limit(limit).lean(),
      User.countDocuments({ role: "user" }),
    ]);

  return {
    users,
    total
  };
};

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select("-__v -password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "user") {
    throw new AppError("This user is not a user", 400);
  }

  await user.deleteOne();

  return user;
};
