"use client";
import { SettingsTab } from "@/lib/types/types";
import { verifyNewEmailOTP } from "@/features/user";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function VerifyNewEmailScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(600);

  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft === 0) return;
    try {
      setIsLoading(true);
      const res = await verifyNewEmailOTP(otp);
      if (res) {
        toast.success("Email changed successfully!");
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || err.error || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Verify New Email
          </h1>
          <p className="text-sm text-gray-500">
            We sent an OTP to your new email address.
          </p>
        </div>
        <p
          className="cursor-pointer text-red-500 text-4xl"
          onClick={() => {
            dispatchAction("mainScreen");
          }}
        >
          ×
        </p>
      </div>
      <div className="flex flex-col items-start gap-3">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-3 w-full"
        >
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          {timeLeft > 0 ? (
            <p className="text-xs text-gray-500 font-medium">
              Time left: {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-xs text-red-500 font-medium">OTP expired</p>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2 disabled:opacity-50"
            disabled={timeLeft === 0 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify New Email"}
          </button>
        </form>
      </div>
    </>
  );
}
