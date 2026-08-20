import { Router } from "express";
import { authorizeRoles, Protect } from "../../middlewares/auth.middleware.js";
import {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  sendOTPValidation,
  resetPasswordValidation,
} from "./auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import rateLimit from "express-rate-limit";
import {
  verifyForgotPasswordOTP,
  verifyRegisterOTP,
} from "./auth.otp.controller.js";
import { googleAuth } from "./google/auth.google.controller.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests, please try again later.",
  },
});

const authRouter = Router();

authRouter.post("/google", googleAuth);

authRouter.post("/login", authLimiter, loginValidation, validate, loginUser);
authRouter.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  registerUser,
);

authRouter.post(
  "/verify-otp",
  authLimiter,
  verifyOTPValidation,
  validate,
  verifyRegisterOTP,
);

authRouter.post(
  "/password/forgot",
  authLimiter,
  sendOTPValidation,
  validate,
  forgotPassword,
);

authRouter.post(
  "/password/forgot/otp",
  authLimiter,
  verifyOTPValidation,
  validate,
  verifyForgotPasswordOTP,
);

authRouter.patch(
  "/password/reset",
  authLimiter,
  resetPasswordValidation,
  validate,
  resetPassword,
);

authRouter.use(Protect);

authRouter.post("/logout", logoutUser);
authRouter.get("/me", getMe);

export default authRouter;
