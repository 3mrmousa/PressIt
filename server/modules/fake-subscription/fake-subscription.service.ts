import AppError from "../../utils/errors/AppError.js";
import User from "../user/user.model.js";
import FakeSubscription from "./fake-subscription.model.js";
import AdminSettings from "../admin/admin.model.js";

export const handleCreated = async (data: any) => {
  const { userId, priceId, subscriptionId } = data;

  const settings = await AdminSettings.findOne();
  const plusPrice = settings?.subscriptionPrices?.plus ?? 9.99;
  const proPrice = settings?.subscriptionPrices?.pro ?? 19.99;

  const PLAN_MAP: Record<string, { plan: "plus" | "pro"; amount: number }> = {
    price_plus: { plan: "plus", amount: plusPrice },
    price_pro: { plan: "pro", amount: proPrice },
  };

  const planData = PLAN_MAP[priceId];
  if (!planData) {
    throw new AppError(`Unsupported price: ${priceId}`, 400);
  }

  await FakeSubscription.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      plan: planData.plan,
      amount: planData.amount,
      fakeSubscriptionId: subscriptionId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { upsert: true, new: true },
  );

  await User.findByIdAndUpdate(userId, {
    plan: planData.plan,
  });

  return {
    success: true,
    message: "Subscription created successfully",
    data: null,
  };
};

export const handleCanceled = async (data: any) => {
  const { subscriptionId } = data;
  const sub = await FakeSubscription.findOneAndUpdate(
    { fakeSubscriptionId: subscriptionId },
    {
      status: "canceled",
    },
    { new: true },
  );

  if (!sub) {
    throw new AppError("Subscription not found", 404);
  }

  await User.findByIdAndUpdate(sub.user, {
    plan: "free",
  });

  return {
    success: true,
    message: "Subscription canceled successfully",
    data: null,
  };
};

export const handleRenewed = async (data: any) => {
  const { subscriptionId } = data;
  await FakeSubscription.findOneAndUpdate(
    { fakeSubscriptionId: subscriptionId },
    {
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  );

  return {
    success: true,
    message: "Subscription renewed successfully",
    data: null,
  };
};
