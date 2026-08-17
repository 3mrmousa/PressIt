import { body } from "express-validator";

export const registerValidation = [
  body("email").trim().isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),
];

export const loginValidation = [
  body("email").trim().isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const sendOTPValidation = [
  body("email").trim().isEmail().withMessage("Email is invalid"),
];

export const verifyOTPValidation = [
  body("email").trim().isEmail().withMessage("Email is invalid"),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 characters long")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

export const resetPasswordValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];