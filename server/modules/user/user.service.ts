import AppError from "../../utils/errors/AppError.js";
import FakeSubscription from "../fake-subscription/fake-subscription.model.js";
import User from "./user.model.js";

export const updateUserProfileService = async (
  userId: string,
  firstName: string,
  lastName: string,
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName },
    { new: true, runValidators: true },
  ).select("-__v -password");

  if (!updatedUser) throw new AppError("User not found", 404);
  return updatedUser;
};

export const updatePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }
  user.password = newPassword;
  await user.save();
  const updatedUser = await User.findById(userId).select("-__v -password");
  return updatedUser;
};

export const updateEmailService = async (userId: string, email: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email },
    { new: true, runValidators: true },
  ).select("-__v -password");
  if (!updatedUser) throw new AppError("User not found", 404);
  return updatedUser;
};

export const deleteUserService = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  await FakeSubscription.deleteMany({ userId: user.id });

  return "User deleted successfully";
};
