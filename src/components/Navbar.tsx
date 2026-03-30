"use client";

import { useSidebar } from "@/context/SidebarContext";
import ProfileMenu from "@/components/ProfileMenu";
import NotificationDropdown from "@/components/NotificationDropdown";

export default function Navbar() {
  const { open } = useSidebar();

  return (
    <header className="
      sticky top-0 z-50
      flex items-center justify-between
      px-6 py-4
      bg-white/5 backdrop-blur-xl
      border-b border-white/10
    ">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* HAMBURGER */}
        <button
          onClick={open}
          className="
            text-xl px-3 py-2 rounded-lg
            bg-white/5 border border-white/10
            hover:bg-white/10 transition
          "
        >
          ☰
        </button>

        {/* LOGO */}
       <span className="
  text-lg sm:text-xl font-bold tracking-wide
  bg-gradient-to-r from-indigo-400 to-purple-500
  bg-clip-text text-transparent
">
  <span className="sm:hidden">CTC</span>
  <span className="hidden sm:inline">CollegeToCareer</span>
</span>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* 🔔 NOTIFICATIONS */}
        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>

        {/* 👤 PROFILE */}
        <ProfileMenu />

      </div>

    </header>
  );
}