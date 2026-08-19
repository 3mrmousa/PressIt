"use client";
import { SettingsTab } from "@/lib/types/types";
import { updateEmail } from "@/features/user";
import toast from "react-hot-toast";
import { useState } from "react";
import { useMe } from "@/hooks/useMe";

export default function ChangeEmailScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [email, setEmail] = useState("");
  const {data} = useMe()
  const [emailPlaceholder, setEmailPlaceholder] = useState(data?.data?.email || "");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await updateEmail(email);
      if (res) {
        toast.success("Verification email sent");
        dispatchAction("verifyCurrentEmail");
      }
    } catch (err: any) {
      toast.error(err.message || err.error || "Failed to change email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Change Email
          </h1>
          <p className="text-sm text-gray-500">
            Enter your new email address to receive a verification code.
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
              New Email Address
            </label>
            <input
              type="text"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Change Email"}
          </button>
        </form>
      </div>
    </>
  );
}
