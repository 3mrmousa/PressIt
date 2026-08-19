import express from "express";
import { Protect } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  updateProfileValidation,
  changePasswordValidation,
  changeEmailValidation,
  verifyOTPValidation,
} from "./user.validation.js";
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  uploadProfilePicture,
  toggleHistory,
} from "./user.controller.js";
import {
  verifyCurrentEmailOTP,
  verifyNewEmailOTP,
} from "./user.otp.controller.js";
import { uploadSingleImageForProfile } from "../../middlewares/upload.middleware.js";
const userRouter = express.Router();

userRouter.use(Protect);

userRouter.get("/all-users", authorizeRoles("admin", "manager"), getAllUsers);
userRouter.get("/user/:id", authorizeRoles("admin", "manager"), getUserById);

userRouter.patch(
  "/update-profile",
  authorizeRoles("admin", "user", "manager"),
  updateProfileValidation,
  validate,
  updateUserProfile,
);
userRouter.patch(
  "/change-password",
  authorizeRoles("admin", "user"),
  changePasswordValidation,
  validate,
  updatePassword,
);
userRouter.patch(
  "/change-email",
  authorizeRoles("admin", "user"),
  changeEmailValidation,
  validate,
  updateEmail,
);

userRouter.post(
  "/change-email/verify-current-otp",
  authorizeRoles("admin", "user"),
  verifyOTPValidation,
  validate,
  verifyCurrentEmailOTP,
);

userRouter.post(
  "/change-email/verify-new-otp",
  authorizeRoles("admin", "user"),
  verifyOTPValidation,
  validate,
  verifyNewEmailOTP,
);

userRouter.patch(
  "/upload-profile-picture",
  uploadSingleImageForProfile,
  uploadProfilePicture,
);

userRouter.patch("/toggle-history", authorizeRoles("user"), toggleHistory);

userRouter.delete("/delete-user", authorizeRoles("user"), deleteUser);

export default userRouter;
