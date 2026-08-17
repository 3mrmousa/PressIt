"use client";
import { SettingsTab } from "@/lib/types/types";
import { updateEmail } from "@/features/user";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangeEmailScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const updateEmailMutation = useMutation({
    mutationFn: () => updateEmail(email),
    onSuccess: () => {
      dispatchAction("verifyCurrentEmail");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Change Email
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
          placeholder="New Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
          onClick={() => updateEmailMutation.mutate()}
        >
          Change Email
        </button>
      </div>
    </>
  );
}
