"use client";
import { SettingsTab } from "@/lib/types/types";
import { updateProfile } from "@/features/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangeProfileScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfile(firstName, lastName),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      dispatchAction("mainScreen");
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
            Change Profile
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
        {error && <p className="text-red-500 text-sm my-3">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfileMutation.mutate();
          }}
          className="flex flex-col items-start gap-3 w-full"
        >
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
}
