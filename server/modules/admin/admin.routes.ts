import { Router } from "express";
import { authorizeRoles, Protect } from "../../middlewares/auth.middleware.js";
import {
  createManager,
  deleteManager,
  getAllManagers,
  getAdminStats,
  getAdminSettings,
  updateAdminSettings,
  getSystemLogs,
  getAllUsers,
  getUserById,
  deleteUser,
  deleteAllSystemLogs,
} from "./admin.controller.js";
import { registerValidation } from "../auth/auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";

import { uploadAdminSettingsImages } from "../../middlewares/upload.middleware.js";

const adminRouter = Router();

adminRouter.get("/settings", getAdminSettings);

adminRouter.use(Protect);


adminRouter.post(
  "/managers",
  authorizeRoles("admin"),
  registerValidation,
  validate,
  createManager,
);

adminRouter.get(
  "/managers",
  authorizeRoles("admin", "manager"),
  getAllManagers,
);

adminRouter.delete("/managers/:id", authorizeRoles("admin"), deleteManager);


adminRouter.get("/stats", authorizeRoles("admin", "manager"), getAdminStats);


adminRouter.patch(
  "/settings",
  authorizeRoles("admin"),
  uploadAdminSettingsImages,
  updateAdminSettings,
);


adminRouter
  .get("/system/logs", authorizeRoles("admin", "manager"), getSystemLogs)
  .delete("/system/logs", authorizeRoles("admin"), deleteAllSystemLogs);


adminRouter.get("/users", authorizeRoles("admin", "manager"), getAllUsers);

adminRouter.get("/users/:id", authorizeRoles("admin", "manager"), getUserById);

adminRouter.delete(
  "/users/:id",
  authorizeRoles("admin"),
  deleteUser,
);

export default adminRouter;
