import express from "express";
import { Protect } from "../../middlewares/auth.middleware.js";
import {
  fakeCheckout,
  fakeWebhook,
  fakeCancel,
  getStatus,
} from "./fake-subscription.controller.js";
const router = express.Router();
router.post("/webhook", fakeWebhook);

router.use(Protect);

router.post("/checkout", fakeCheckout);

router.post("/cancel", fakeCancel);

router.get("/status", getStatus);


export default router;
