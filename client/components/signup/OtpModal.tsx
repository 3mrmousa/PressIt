"use client";

import { verifyOtp } from "@/features/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [error, setError] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.replace("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center">
        {error && (
          <p className="text-sm text-red-600 text-center my-5">
            Failed to verify OTP: {error}
          </p>
        )}
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
          type="button"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2"
          onClick={() => verifyOtpMutation.mutate({ email, otp })}
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
