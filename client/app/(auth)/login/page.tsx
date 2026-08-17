"use client";
import { GoogleButton } from "@/components/shared/GoogleButton";
import { login } from "@/features/auth";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),

    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      router.replace("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center bg-linear-to-b from-white to-purple-50 px-4 py-12 mt-6">
      <div className="flex flex-col lg:flex-row  w-full max-w-7xl items-center justify-center gap-8 xl:gap-16">
        


        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10 shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">
            Log in to your PressIt account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
              <Link
                href="/password/forgot"
                className="text-xs text-purple-600 hover:underline font-medium mt-1 self-end"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2"
            >
              {mutation.isPending ? "Logging in..." : "Log in"}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center my-5">
                Failed to login: {error}
              </p>
            )}
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleButton />

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>



      </div>
    </div>
  );
}
