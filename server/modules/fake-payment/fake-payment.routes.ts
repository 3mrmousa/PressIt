import express from "express";
import { Protect, authorizeRoles } from "../../middlewares/auth.middleware.js";
import {
  fakeCheckout,
  fakeWebhook,
  fakeCancel,
  getStatus,
  getAdminRevenueStats,
} from "./fake-payment.controller.js";
const router = express.Router();
router.post("/webhook", fakeWebhook);
router.use(Protect);
router.post("/checkout", fakeCheckout);
router.post("/cancel", fakeCancel);
router.get("/status", getStatus);
router.get("/admin/revenue", authorizeRoles("admin"), getAdminRevenueStats);
export default router;
