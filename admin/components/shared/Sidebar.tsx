"use client";
import SidebarLogo from "./SidebarLogo";
import SideBarLinks from "./SideBarLinks";
import SidebarFooter from "./SidebarFooter";
import { AlignJustify, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-40 p-2 text-gray-900 bg-white rounded-md shadow-sm border border-gray-200 transition-opacity duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <AlignJustify size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-black border-r border-white/5 text-white flex 
          flex-col px-6 py-6 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          className="absolute top-6 right-4 z-50 md:hidden text-gray-400 hover:text-white"
          onClick={toggleSidebar}
        >
          <X size={24} />
        </button>

        <SidebarLogo />
        <SideBarLinks />
        <SidebarFooter />
      </div>
    </>
  );
}
