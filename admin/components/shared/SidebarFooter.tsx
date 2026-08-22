"use client";
import Link from "next/link";
import { Settings, LogOut, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../../features/auth";
import toast from "react-hot-toast";

export default function SidebarFooter() {
  const path = usePathname();

  const router = useRouter();

  const getLinkClass = (href: string) => {
    const isActive = path === href;
    return `border-l-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "border-purple-600 text-white bg-white/5"
        : "border-transparent text-gray-400 hover:border-white hover:text-white hover:bg-white/10"
    }`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="px-4 pb-6 space-y-1">
      <Link href="/profile" className={getLinkClass("/profile")}>
        <UserCircle className="w-4.5 h-4.5" />
        Profile
      </Link>
      <Link href="/settings" className={getLinkClass("/settings")}>
        <Settings className="w-4.5 h-4.5" />
        Settings
      </Link>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border-l-2 border-transparent text-gray-400 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10">
        <LogOut className="w-4.5 h-4.5" />
        Logout
      </button>
    </div>
  );
}
