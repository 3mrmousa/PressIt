import { client } from "@/lib/client";

export interface SubscriptionData {
  _id?: string;
  user: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused";
  fakeSubscriptionId: string;
  amount: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}

export async function getFakeSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  return client<SubscriptionStatusResponse>("/fake-subscription/status");
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: { transactionId: string };
}

export async function createCheckout(
  priceId: string,
): Promise<CheckoutResponse> {
  return client<CheckoutResponse>("/fake-subscription/checkout", {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
}


export interface CancelResponse {
  success: boolean;
  message: string;
}

export async function cancelSubscription(): Promise<CancelResponse> {
  return client<CancelResponse>("/fake-subscription/cancel", {
    method: "POST",
  });
}
