"use client";
import { SettingsTab } from "@/lib/types/types";
import { SaveHistoryToggle } from "../SaveHistoryToggle";

export default function MainScreen({
  state,
  dispatchAction,
  onCloseAction,
}: {
  state: SettingsTab;
  dispatchAction: (action: SettingsTab) => void;
  onCloseAction: () => void;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your profile, email, and password.
          </p>
        </div>
        <p
          className="cursor-pointer text-red-500 text-4xl"
          onClick={onCloseAction}
        >
          ×
        </p>
      </div>
      <div className="flex flex-col items-start gap-3">
        <button
          onClick={() => dispatchAction("changeProfile")}
          className="w-full text-left px-4 py-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg transition-colors font-medium text-gray-700 hover:text-purple-700 cursor-pointer"
        >
          Change Profile
        </button>
        <button
          onClick={() => dispatchAction("changeEmail")}
          className="w-full text-left px-4 py-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg transition-colors font-medium text-gray-700 hover:text-purple-700 cursor-pointer"
        >
          Change Email
        </button>
        <button
          onClick={() => dispatchAction("changePassword")}
          className="w-full text-left px-4 py-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg transition-colors font-medium text-gray-700 hover:text-purple-700 cursor-pointer"
        >
          Change Password
        </button>

        <SaveHistoryToggle />
      </div>
    </>
  );
}
