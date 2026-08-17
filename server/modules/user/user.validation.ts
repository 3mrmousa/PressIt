import { body } from "express-validator";

const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters long"),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters long"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("newPassword")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const changeEmailValidation = [
  body("newEmail")
    .trim()
    .notEmpty()
    .withMessage("New email is required")
    .isEmail()
    .withMessage("Invalid email"),
];

const verifyOTPValidation = [
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 characters long")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

export {
  updateProfileValidation,
  changePasswordValidation,
  changeEmailValidation,
  verifyOTPValidation,
};
