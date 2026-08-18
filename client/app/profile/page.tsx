"use client";
import { useMe } from "@/hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUser,
  faCalendarAlt,
  faCheckCircle,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { SettingsModal } from "@/components/peofile/SettingsModal";
import Link from "next/link";

export default function ProfilePage() {
  const [settingsModal, setSettingsModal] = useState(false);
  const { data, isLoading, error } = useMe();
  const userInfo = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-white to-purple-50">
        <p className="text-red-500 font-medium">Failed to load profile.</p>
      </div>
    );
  }

  const initials = `${userInfo.firstName?.charAt(0) || ""}${userInfo.lastName?.charAt(0) || ""}`;
  const memberSince = new Date(userInfo.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-white to-purple-50 p-6 pt-24 font-sans">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl items-center justify-center gap-8 xl:gap-16">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-purple-500/10 w-full max-w-lg overflow-hidden border border-purple-100 shrink-0">
            <div className="h-32 bg-linear-to-r from-purple-500 to-purple-700"></div>
            <button
              onClick={() => {
                setSettingsModal(!settingsModal);
              }}
            >
              <FontAwesomeIcon
                icon={faGears}
                className="text-2xl text-white absolute top-5 right-5 z-1 hover:scale-125 transition-all duration-200 cursor-pointer"
              />
            </button>
            <div className="relative px-8 flex justify-center -mt-16 mb-4">
              <div className="h-32 w-32 bg-white rounded-full p-2 shadow-lg">
                {userInfo.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-600 tracking-wider">
                      {initials.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 pb-10 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
                <p>{userInfo.email}</p>
                {userInfo.emailVerified && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500"
                    title="Verified Email"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                      Role
                    </p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {userInfo.role}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-500/70 font-medium uppercase tracking-wider">
                      Plan
                    </p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {userInfo.plan}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4 md:col-span-2 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                      Member Since
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {memberSince}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-100">
                <Link
                  href="/pricing"
                  className="w-full block text-center py-3 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                >
                  ⚡ Upgrade Your Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={settingsModal}
        onCloseAction={() => setSettingsModal(false)}
      />
    </>
  );
}
