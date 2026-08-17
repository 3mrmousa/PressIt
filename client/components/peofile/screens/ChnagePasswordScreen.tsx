"use client";
import { SettingsTab } from "@/lib/types/types";
import { changePassword } from "@/lib/user";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangePasswordScreen({
  dispatchAction,
}: {
  dispatchAction: (action: SettingsTab) => void;
}) {
  const [currentPasswordShow, setCurrentPasswordShow] = useState(false);
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),

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
            Change Password
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
      <div className="flex flex-col items-center gap-3">
        {error && <p className="text-red-500 text-sm my-3">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePasswordMutation.mutate();
          }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div className="relative w-full">
            <input
              type={currentPasswordShow ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <FontAwesomeIcon
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              icon={currentPasswordShow ? faEyeSlash : faEye}
              onClick={() => setCurrentPasswordShow(!currentPasswordShow)}
            />
          </div>
          <div className="relative w-full">
            <input
              type={newPasswordShow ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <FontAwesomeIcon
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              icon={newPasswordShow ? faEyeSlash : faEye}
              onClick={() => setNewPasswordShow(!newPasswordShow)}
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer w-full"
          >
            Change Password
          </button>
        </form>
      </div>
    </>
  );
}
