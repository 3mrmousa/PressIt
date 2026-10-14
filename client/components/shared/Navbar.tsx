"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/hooks/useMe";
import { logout } from "@/features/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminSettings } from "@/features/settings";
import Image from "next/image";

const planColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  plus: "bg-purple-100 text-purple-700",
  pro: "bg-amber-100 text-amber-700",
};

export const Navbar = () => {
  const { data: response } = useMe();
  const queryClient = useQueryClient();

  const userInfo: any = response?.data;

  const isLoggedIn = !!userInfo;

  const router = useRouter();

  const [adminSettings, setAdminSettings] = useState<any>(null);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  useEffect(() => {
    const handleGetAdminSettings = async () => {
      const response = await getAdminSettings();
      const settings = response.data;
      setAdminSettings(settings);
    };
    handleGetAdminSettings();
  }, []);

  const initials = `${userInfo?.firstName?.[0] ?? ""}${userInfo?.lastName?.[0] ?? ""}`;

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/50 border-b border-purple-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={adminSettings?.logo?.secure_url || "/logo.svg"}
            alt={`${adminSettings?.siteName || "PressIt"} Logo`}
            width={140}
            height={36}
            className="object-contain"
            priority
          />
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className={`text-xs ${planColors[userInfo.plan]} font-semibold px-2.5 py-0.5 rounded-full capitalize`}
            >
              {userInfo.plan}
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              History
            </Link>
            <Link href="/profile" className="flex items-center gap-2">
              <span>
                {userInfo.profilePicture?.secure_url ? (
                  <img
                    src={userInfo.profilePicture.secure_url}
                    alt={userInfo.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className=" p-2 h-full w-full rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-md font-bold text-purple-600 tracking-wider">
                      {initials.toUpperCase()}
                    </span>
                  </div>
                )}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-sm md:text-md bg-purple-600 hover:bg-purple-700 text-white font-medium md:px-5 px-2 py-2 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
