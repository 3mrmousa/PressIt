"use client";
import { SettingsTab } from "@/lib/types/types";

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Settings Modal
          </h1>
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
          onClick={() => {
            dispatchAction("changeProfile");
          }}
          className="px-3 py-2 border-2 border-purple-500 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer w-1/2 mx-auto text-white"
        >
          Change Profile
        </button>
        <button
          onClick={() => {
            dispatchAction("changeEmail");
          }}
          className="px-3 py-2 border-2 border-purple-500 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer w-1/2 mx-auto text-white"
        >
          Change Email
        </button>
        <button
          onClick={() => {
            dispatchAction("changePassword");
          }}
          className="px-3 py-2 border-2 border-purple-500 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer w-1/2 mx-auto text-white"
        >
          Change Password
        </button>
      </div>
    </>
  );
}
