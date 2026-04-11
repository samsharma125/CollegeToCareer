"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import ProfileMenu from "@/components/ProfileMenu";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { open } = useSidebar();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      setRole(profile?.role || null);
    };

    loadRole();
  }, []);

  // ⏳ Prevent flicker
  if (!role) return null;

  return (
    <header
      className="
      sticky top-0 z-50
      flex items-center justify-between
      px-4 sm:px-6 py-4
      bg-white/5 backdrop-blur-xl
      border-b border-white/10
    "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={open}
          className="
            text-lg sm:text-xl px-3 py-2 rounded-lg
            bg-white/5 border border-white/10
            hover:bg-white/10 transition
          "
        >
          ☰
        </button>

        <span
          className="
          text-base sm:text-xl font-bold tracking-wide
          bg-gradient-to-r from-indigo-400 to-purple-500
          bg-clip-text text-transparent
        "
        >
          <span className="sm:hidden">CTC</span>
          <span className="hidden sm:inline">CollegeToCareer</span>
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* ✅ ONLY FOR STUDENTS */}
        {role === "student" && (
          <button
            onClick={() => router.push("/leaderboard")}
            className="
              flex items-center gap-1 sm:gap-2
              px-3 sm:px-4 py-2 rounded-xl
              bg-gradient-to-r from-yellow-400 to-orange-500
              text-black font-semibold
              shadow-[0_0_15px_rgba(255,200,0,0.6)]
              hover:scale-105 hover:shadow-xl
              transition-all duration-200
              text-sm sm:text-base
            "
          >
            <span className="text-base sm:text-lg">🏆</span>
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
        )}

        <NotificationDropdown />
        <ProfileMenu />
      </div>
    </header>
  );
}