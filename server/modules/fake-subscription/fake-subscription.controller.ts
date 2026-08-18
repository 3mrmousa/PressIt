import crypto from "crypto";
import asyncHandler from "../../utils/errors/asyncHandler.js";
import { AuthRequest } from "../../types/authRequest.type.js";
import { Response, Request } from "express";
import AppError from "../../utils/errors/AppError.js";
import {
  handleCanceled,
  handleCreated,
  handleRenewed,
} from "./fake-subscription.service.js";
import FakeSubscription from "./fake-subscription.model.js";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.FAKE_WEBHOOK_SECRET || "my-super-secret-key";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}

// ─── POST /checkout ──────────────────────────────────────

export const fakeCheckout = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const { priceId } = req.body;
    if (!priceId || !["price_plus", "price_pro"].includes(priceId)) {
      throw new AppError("Use price_plus or price_pro", 400);
    }

    if (!["price_plus", "price_pro"].includes(priceId)) {
      throw new AppError("Invalid price ID", 400);
    }

    const fakeSubscriptionId = `sub-${crypto.randomUUID()}`;

    await handleCreated({
      userId: req.user._id,
      priceId,
      subscriptionId: fakeSubscriptionId,
    });

    res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscriptionId: fakeSubscriptionId,
        plan: priceId === "price_plus" ? "plus" : "pro",
      },
    });
  },
);

// ─── POST /webhook ───────────────────────────────────────

export const fakeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-webhook-signature"] as string;
  if (!signature) {
    throw new AppError("Missing signature", 400);
  }

  const rawBody = JSON.stringify(req.body);
  if (!verifySignature(rawBody, signature)) {
    throw new AppError("Invalid signature", 400);
  }

  const { eventType, data } = req.body;
  console.log(`webhook received: ${eventType}`);

  switch (eventType) {
    case "subscription.created":
      await handleCreated(data);
      break;
    case "subscription.canceled":
      await handleCanceled(data);
      break;
    case "subscription.renewed":
      await handleRenewed(data);
      break;
    default:
      console.log(`⚠️ Unhandled event: ${eventType}`);
  }

  res.status(200).json({ received: true });
});

export const getStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AppError("Not authorized", 401);
    const sub = await FakeSubscription.findOne({ user: req.user._id }).lean();
    res.json({
      success: true,
      data: sub || { plan: "free", status: "none" },
    });
  },
);

export const fakeCancel = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new AppError("Not authorized", 401);
    const sub = await FakeSubscription.findOne({ user: req.user._id });
    if (!sub) throw new AppError("No active subscription", 404);
    await handleCanceled({ subscriptionId: sub.fakeSubscriptionId });
    res.json({
      success: true,
      message: "Subscription canceled. You are now on the free plan.",
    });
  },
);

// ─── GET /admin/revenue ──────────────────────────────────
export const getAdminRevenueStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const aggregationResult = await FakeSubscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
    ]);
    const totalEarnings = aggregationResult[0]?.totalEarnings || 0;

    const subscriptions = await FakeSubscription.find()
      .populate("user", "firstName lastName email")
      .sort("-createdAt");

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalActive: await FakeSubscription.countDocuments({
          status: "active",
        }),
        subscriptions,
      },
    });
  },
);
