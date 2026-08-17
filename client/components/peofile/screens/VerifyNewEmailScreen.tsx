"use client";
import { SettingsTab } from "@/lib/types/types";
import { verifyNewEmailOTP } from "@/features/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function VerifyNewEmailScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(600);

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const verifyNewEmailOtpMutation = useMutation({
    mutationFn: () => verifyNewEmailOTP(otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      dispatchAction("mainScreen");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Verify New Email
          </h1>
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
        {error && <p className="text-red-600 text-sm my-3">{error}</p>}
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
        />
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500">
            Time left: {minutes}:{seconds}
          </p>
        ) : (
          <p className="text-sm text-red-500">OTP expired</p>
        )}
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
          onClick={() => verifyNewEmailOtpMutation.mutate()}
          disabled={timeLeft === 0}
        >
          Verify New Email
        </button>
      </div>
    </>
  );
}
