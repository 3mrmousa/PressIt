"use client";
import { SettingsTab } from "@/lib/types/types";
import { updateProfile } from "@/features/user";
import toast from "react-hot-toast";
import { useState } from "react";
import { useMe } from "@/hooks/useMe";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ChangeProfileScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const { data } = useMe();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [firstNamePlaceholder, setFirstNamePlaceholder] = useState(
    data?.data?.firstName || ""
  );
  const [lastNamePlaceholder, setLastNamePlaceholder] = useState(
    data?.data?.lastName || ""
  );

  const updateMutation = useMutation({
    mutationFn: () => updateProfile(firstName, lastName),
    onSuccess: (res) => {
      if (res) {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || err.error || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Change Profile
          </h1>
          <p className="text-sm text-gray-500">
            Update your personal details below.
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
              First Name
            </label>
            <input
              type="text"
              placeholder={firstNamePlaceholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder={lastNamePlaceholder}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 cursor-pointer mt-2 disabled:opacity-50"
          >
            {updateMutation.isPending ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </>
  );
}
