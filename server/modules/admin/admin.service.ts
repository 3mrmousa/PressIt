import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";
import AppError from "../../utils/errors/AppError.js";
import { uploadLogoToCloudinary } from "../../utils/uploadToCloudinary.js";
import FakeSubscription from "../fake-subscription/fake-subscription.model.js";
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

  const [managers, total] = await Promise.all([
    User.find({ role: "manager" })
      .select("-__v -password")
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ role: "manager" }),
  ]);

  return {
    managers,
    total,
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
  siteName?: string,
  plus?: number,
  pro?: number,
  logo?: Buffer,
  favicon?: Buffer,
) => {
  let settings = await AdminSettings.findOne();

  let logo_secure_url, logo_public_id;
  if (logo) {
    const uploaded = await uploadLogoToCloudinary(logo);
    logo_secure_url = uploaded.secure_url;
    logo_public_id = uploaded.public_id;
  }

  let favicon_secure_url, favicon_public_id;
  if (favicon) {
    const uploaded = await uploadLogoToCloudinary(favicon);
    favicon_secure_url = uploaded.secure_url;
    favicon_public_id = uploaded.public_id;
  }

  if (!settings) {
    settings = await AdminSettings.create({
      ...(siteName && { siteName }),
      subscriptionPrices: {
        ...(plus !== undefined && { plus }),
        ...(pro !== undefined && { pro }),
      },
      ...(logo && {
        logo: { secure_url: logo_secure_url, public_id: logo_public_id },
      }),
      ...(favicon && {
        favicon: {
          secure_url: favicon_secure_url,
          public_id: favicon_public_id,
        },
      }),
    });
  } else {
    if (siteName !== undefined) settings.siteName = siteName;

    if (logo !== undefined && logo_secure_url && logo_public_id) {
      if (settings.logo?.public_id) {
        await deleteFromCloudinary(settings.logo?.public_id);
      }
      settings.logo = {
        secure_url: logo_secure_url,
        public_id: logo_public_id,
      };
    }

    if (favicon !== undefined && favicon_secure_url && favicon_public_id) {
      if (settings.favicon?.public_id) {
        await deleteFromCloudinary(settings.favicon?.public_id);
      }
      settings.favicon = {
        secure_url: favicon_secure_url,
        public_id: favicon_public_id,
      };
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

export const deleteAllSystemLogsService = async () => {
  await SystemLog.deleteMany({});
};

export const getAllUsersService = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ role: "user" })
      .select("-__v -password")
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ role: "user" }),
  ]);

  return {
    users,
    total,
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

  await FakeSubscription.deleteMany({ userId: user.id });
  await user.deleteOne();

  return user;
};
