"use client";


import { useMe } from "@/hooks/useMe";
import { useSubscription } from "@/hooks/useSubscription";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faBolt,
  faCrown,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import { createCheckout } from "@/features/subscription";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    icon: faBolt,
    color: "gray",
    features: [
      "10 compressions/day",
      "All image formats",
      "Instant download",
      "Zero storage",
    ],
    priceId: null,
  },
  {
    id: "plus",
    name: "Plus",
    price: "$9",
    period: "/month",
    icon: faCrown,
    color: "purple",
    popular: true,
    features: [
      "200 compressions/day",
      "All image formats",
      "Instant download",
      "Zero storage",
      "Priority processing",
    ],
    priceId: "plus-mock-id",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    icon: faRocket,
    color: "amber",
    features: [
      "1,000 compressions/day",
      "All image formats",
      "Instant download",
      "Zero storage",
      "Priority processing",
      "Batch compression",
    ],
    priceId: "pro-mock-id",
  },
];

export default function PricingPage() {

  const { data: meData } = useMe();
  const user = meData?.data;
  const isLoggedIn = !!user;
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: subData } = useSubscription(isLoggedIn);
  const currentPlan = user?.plan || "free";

  const openCheckout = async (priceId: string) => {
    if (!user) return;
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      // Create transaction server-side (locks quantity to 1, embeds userId)
      const { data } = await createCheckout(priceId);
      
      // Mocked checkout flow
      console.log("Mock checkout opened for:", data.transactionId);
      alert("Payment system temporarily disabled.");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setCheckoutError(err.message || "Failed to open checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-white to-purple-50 px-6 pt-24 pb-20 font-sans">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-purple-600 tracking-wider uppercase mb-3">
          Pricing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {checkoutError && (
        <div className="mb-8 px-6 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center max-w-md">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const borderColor =
            plan.color === "purple"
              ? "border-purple-300 shadow-purple-200/50"
              : plan.color === "amber"
                ? "border-amber-300 shadow-amber-200/50"
                : "border-gray-200";

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border-2 ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    plan.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : plan.color === "amber"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FontAwesomeIcon icon={plan.icon} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`text-sm ${
                        plan.color === "purple"
                          ? "text-purple-500"
                          : plan.color === "amber"
                            ? "text-amber-500"
                            : "text-gray-400"
                      }`}
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                isCurrent ? (
                  <div className="w-full py-3 rounded-full text-center text-sm font-semibold bg-gray-100 text-gray-500">
                    Current Plan
                  </div>
                ) : (
                  <div className="w-full py-3 rounded-full text-center text-sm font-semibold bg-gray-100 text-gray-400">
                    Free Forever
                  </div>
                )
              ) : isCurrent ? (
                <div className="w-full py-3 rounded-full text-center text-sm font-semibold bg-purple-100 text-purple-600">
                  ✓ Current Plan
                </div>
              ) : !isLoggedIn ? (
                <Link
                  href="/login"
                  className="w-full py-3 rounded-full text-center text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 block"
                >
                  Sign up to upgrade
                </Link>
              ) : (
                <button
                  onClick={() => openCheckout(plan.priceId!)}
                  disabled={checkoutLoading}
                  className="w-full py-3 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? "Loading..." : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
