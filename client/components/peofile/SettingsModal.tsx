"use client";

import { useReducer } from "react";
import MainScreen from "./screens/MainScreen";
import { SettingsTab } from "@/lib/types/types";
import ChangeProfileScreen from "./screens/ChangeProfileScreen";
import ChangeEmailScreen from "./screens/ChangeEmailScreen";
import VerifyCurrentEmailScreen from "./screens/VerifyCurrentEmailScreen";
import VerifyNewEmailScreen from "./screens/VerifyNewEmailScreen";
import ChangePasswordScreen from "./screens/ChnagePasswordScreen";

function reducer(state: SettingsTab, action: SettingsTab): SettingsTab {
  switch (action) {
    case "mainScreen": {
      return "mainScreen";
    }
    case "changeProfile": {
      return "changeProfile";
    }
    case "changeEmail": {
      return "changeEmail";
    }
    case "verifyCurrentEmail": {
      return "verifyCurrentEmail";
    }
    case "verifyNewEmail": {
      return "verifyNewEmail";
    }
    case "changePassword": {
      return "changePassword";
    }
    default: {
      return state;
    }
  }
}

export const SettingsModal = ({
  isOpen,
  onCloseAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
}) => {
  const [state, dispatch] = useReducer(reducer, "mainScreen");

  return (
    isOpen && (
      <div className="fixed z-2 top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
        <div className="w-xs md:w-md bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center gap-5">
          {state === "mainScreen" && (
            <MainScreen
              state={state}
              dispatchAction={dispatch}
              onCloseAction={onCloseAction}
            />
          )}
          {state === "changeProfile" && (
            <ChangeProfileScreen dispatchAction={dispatch} />
          )}
          {state === "changeEmail" && (
            <ChangeEmailScreen dispatchAction={dispatch} />
          )}
          {state === "verifyCurrentEmail" && (
            <VerifyCurrentEmailScreen dispatchAction={dispatch} />
          )}
          {state === "verifyNewEmail" && (
            <VerifyNewEmailScreen dispatchAction={dispatch} />
          )}
          {state === "changePassword" && (
            <ChangePasswordScreen dispatchAction={dispatch} />
          )}
        </div>
      </div>
    )
  );
};
