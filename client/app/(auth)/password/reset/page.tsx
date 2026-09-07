"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/features/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const resetMutation = useMutation({
    mutationFn: () => resetPassword(email, newPassword),
    onSuccess: () => {
      router.push("/login");
      sessionStorage.removeItem("resetPasswordEmail");
    },
    onError: (err: any) => {
      if (err.message) setError(err.message);
      else setError("Failed to reset password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) return;
    setError(null);
    resetMutation.mutate();
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/password/forgot");
    }
  }, []);

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center bg-linear-to-b from-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h1>
        <p
          className={`text-sm mb-8 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {error ? error : `Enter your new password for ${email}`}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <FontAwesomeIcon
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-1/2 mx-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {resetMutation.isPending
              ? "Resetting password..."
              : "Reset password"}
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
