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
} from "./admin.controller.js";
import { registerValidation } from "../auth/auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";

const adminRouter = Router();

adminRouter.use(Protect);

// ─── POST /admin/managers ──────────────────────────────────
adminRouter.post(
  "/manager",
  authorizeRoles("admin"),
  registerValidation,
  validate,
  createManager,
);

adminRouter.get("/managers", authorizeRoles("admin", "manager"), getAllManagers);

adminRouter.delete("/manager/:id", authorizeRoles("admin"), deleteManager);

// ─── GET /admin/stats ──────────────────────────────────
adminRouter.get("/stats", authorizeRoles("admin", "manager"), getAdminStats);

// ─── GET /admin/settings ──────────────────────────────────
adminRouter.get(
  "/settings",
  authorizeRoles("admin", "manager"),
  getAdminSettings,
).patch(
  "/settings",
  authorizeRoles("admin", "manager"),
  updateAdminSettings,
);

// ─── GET /admin/system/logs ──────────────────────────────────
adminRouter.get("/system/logs", authorizeRoles("admin", "manager"), getSystemLogs);

// ─── GET /admin/users ──────────────────────────────────
adminRouter.get("/users", authorizeRoles("admin", "manager"), getAllUsers);

adminRouter.get("/users/:id", authorizeRoles("admin", "manager"), getUserById);

adminRouter.delete("/users/:id", authorizeRoles("admin", "manager"), deleteUser);

export default adminRouter;
