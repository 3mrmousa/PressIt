"use client";

import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname === "/login" || pathname === "/signup";

  return (
    <>
      <Navbar />

      <main className="mt-10 md:mt-0 flex-1 flex flex-col">{children}</main>

      {!hideLayout && <Footer />}
    </>
  );
}
