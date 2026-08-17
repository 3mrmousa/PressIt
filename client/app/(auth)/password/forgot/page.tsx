"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/features/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const forgotPasswordMutaion = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      sessionStorage.setItem("forgotPasswordEmail", email);
      router.push("/password/forgot/otp");
    },
    onError: (error: any) => {
      if (error.message) setError(error.message);
      else setError("Failed to send OTP");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    forgotPasswordMutaion.mutate(email);
  };

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center bg-linear-to-b from-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Forgot Password
        </h1>
        <p
          className={`text-sm mb-8 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {error ? error : "Enter your email to reset your password"}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={forgotPasswordMutaion.isPending}
            className="w-1/2 mx-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {forgotPasswordMutaion.isPending ? "Sending OTP..." : "Continue"}
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
