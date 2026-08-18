"use client";

import { verifyOtp } from "@/features/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OtpModal({
  email,
  isOpen,
  onCloseAction,
}: {
  email: string;
  isOpen: boolean;
  onCloseAction: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await verifyOtp(email, otp);
      if (res) {
        window.location.href = "/";
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error: any) {
      toast.error(error.message || error.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center justify-center z-50">
        <div className="flex flex-row items-start justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">OTP Modal</h1>
            <p className="text-sm text-gray-500 mb-8">
              Enter the OTP sent to {email}
            </p>
          </div>
          <p className="cursor-pointer text-red-500 text-4xl" onClick={onCloseAction}>
            ×
          </p>
        </div>
        <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        </form>
      </div>
    </div>
  );
}
