import { Router } from "express";
import { authorizeRoles, Protect } from "../../middlewares/auth.middleware.js";
import {
  createManager,
  deleteManager,
  getAdminStats,
  getAdminSettings,
  updateAdminSettings,
  getSystemLogs,
  getAllUsers,
  getUserById,
} from "./admin.controller.js";
import { registerValidation } from "../auth/auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";

const adminRouter = Router();

adminRouter.use(Protect);

// ─── POST /admin/manager ──────────────────────────────────
adminRouter.post(
  "/manager",
  authorizeRoles("admin"),
  registerValidation,
  validate,
  createManager,
);

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

// ─── GET /admin/all-users ──────────────────────────────────
adminRouter.get("/all-users", authorizeRoles("admin", "manager"), getAllUsers);

// ─── GET /admin/user/:id ──────────────────────────────────
adminRouter.get("/user/:id", authorizeRoles("admin", "manager"), getUserById);

export default adminRouter;
