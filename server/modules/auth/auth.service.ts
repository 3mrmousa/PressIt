import AppError from "../../utils/errors/AppError.js";
import User from "../user/user.model.js";


export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return user;
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

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
