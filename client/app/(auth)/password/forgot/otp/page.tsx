"use client";
import { forgotPasswordOtp } from "@/features/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const verifyOtpMutaion = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      forgotPasswordOtp(email, otp),
    onSuccess: () => {
      router.push("/password/reset");
      sessionStorage.setItem("resetPasswordEmail", email);
      sessionStorage.removeItem("forgotPasswordEmail");
    },
    onError: (error: any) => {
      if (error.message) setError(error.message);
      else setError("Failed to verify OTP");
    },
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
    if (!storedEmail) {
      router.replace("/password/forgot");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  if (!email) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutaion.mutate({ email, otp });
  };

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center bg-linear-to-b from-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h1>
        <p
          className={`text-sm mb-8 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {error ? error : `Enter the OTP sent to ${email}`}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={verifyOtpMutaion.isPending}
            className="w-1/2 mx-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {verifyOtpMutaion.isPending ? "Verifying OTP..." : "Verify OTP"}
          </button>
          <Link
            href="/login"
            className="text-center text-sm text-purple-600 hover:underline font-medium"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}
