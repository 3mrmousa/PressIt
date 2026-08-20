"use client";
import Link from "next/link";
import { Cog, LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SideBarLinks() {
  const path = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = path === href;
    return `border-l-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "border-purple-600 text-white bg-white/5"
        : "border-transparent text-gray-400 hover:border-white hover:text-white hover:bg-white/10"
    }`;
  };

  return (
    <nav className="flex-1 px-4 space-y-1 mt-4">
      <Link href="/" className={getLinkClass("/")}>
        <LayoutDashboard className="w-4.5 h-4.5" />
        Dashboard
      </Link>
      <Link href="/users" className={getLinkClass("/users")}>
        <Users className="w-4.5 h-4.5" />
        Users
      </Link>
      <Link href="/managers" className={getLinkClass("/managers")}>
        <Cog className="w-4.5 h-4.5" />
        Managers
      </Link>
    </nav>
  );
}
