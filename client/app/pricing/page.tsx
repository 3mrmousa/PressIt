"use client";

import { useMe } from "@/hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faBolt,
  faCrown,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  cancelSubscription,
  createCheckout,
} from "@/features/fake-subscription";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminSettings } from "@/features/settings";

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
    price: "$10",
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
    priceId: "price_plus",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20",
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
    priceId: "price_pro",
  },
];

export default function PricingPage() {
  const { data: meData } = useMe();
  const queryClient = useQueryClient();
  const user = meData?.data;
  const isLoggedIn = !!user;
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const currentPlan = user?.plan || "free";

  const handleCheckout = async (priceId: string) => {
    if (!user) return;
    setCheckoutLoading(true);

    try {
      await createCheckout(priceId);
      toast.success("Checkout processed successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err: any) {
      toast.error(
        err.message || "Something went wrong. Please try again later.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    setCheckoutLoading(true);

    try {
      await cancelSubscription();
      toast.success("Checkout processed successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err: any) {
      toast.error(
        err.message || "Something went wrong. Please try again later.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const [adminSettings, setAdminSettings] = useState<any>(null);

  useEffect(() => {
    const handleGetAdminSettings = async () => {
      const response = await getAdminSettings();
      const settings = response.data;
      setAdminSettings(settings);
    };
    handleGetAdminSettings();
  }, []);

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
                  {plan.id === "plus"
                    ? (adminSettings?.subscriptionPrices?.plus
                        ? adminSettings?.subscriptionPrices?.plus
                        : plan.price)
                    : plan.id === "pro"
                      ? (adminSettings?.subscriptionPrices?.pro
                          ? adminSettings?.subscriptionPrices?.pro
                          : plan.price)
                      : plan.price}
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
                  onClick={() => handleCheckout(plan.priceId!)}
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
      {isLoggedIn && (
        <p className="mt-10 text-sm text-gray-400 text-center">
          You can cancel from{" "}
          <button
            onClick={handleCancel}
            disabled={checkoutLoading}
            className="font-semibold text-md text-purple-600 cursor-pointer"
          >
            here
          </button>
        </p>
      )}
    </div>
  );
}
