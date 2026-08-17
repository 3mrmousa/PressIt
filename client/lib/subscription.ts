import { api } from "./api";

export interface SubscriptionData {
  _id?: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused" | "trialing";
  paddleSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}

export interface PortalResponse {
  success: boolean;
  data: { portalUrl: string };
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  return api<SubscriptionStatusResponse>("/subscription/status");
}

export async function getPortalUrl(): Promise<PortalResponse> {
  return api<PortalResponse>("/subscription/portal");
}

export interface CheckoutResponse {
  success: boolean;
  data: { transactionId: string };
}

export async function createCheckout(priceId: string): Promise<CheckoutResponse> {
  return api<CheckoutResponse>("/subscription/checkout", {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
}