"use client";

import { useSidebar } from "@/context/SidebarContext";
import ProfileMenu from "@/components/ProfileMenu";

import NotificationDropdown from "@/components/NotificationDropdown";

export default function Navbar() {
  const { open } = useSidebar();

  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
      
      {/* LEFT: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={open}
          className="text-2xl"
          aria-label="Open sidebar"
        >
          ☰
        </button>

        <span className="text-xl font-bold">
          CollegeToCareer
        </span>
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* 🔔 ADDED */}
         <NotificationDropdown />
        <ProfileMenu />
      </div>

    </header>
  );
}