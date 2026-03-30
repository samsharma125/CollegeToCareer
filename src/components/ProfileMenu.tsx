"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, ChevronDown, LogOut } from "lucide-react";

export default function ProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      setEmail(data.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setName(profile.name);
        setRole(profile.role);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">

      {/* 🔥 BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-3
          px-3 py-2 rounded-xl
          bg-white/5 border border-white/10
          backdrop-blur-xl
          hover:bg-white/10
          transition-all duration-200
        "
      >
        {/* AVATAR */}
        <div className="
          w-9 h-9 rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-600
          flex items-center justify-center
          text-white text-sm font-semibold
        ">
          {initial}
        </div>

        {/* INFO */}
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-sm font-medium text-white">
            {name || "User"}
          </span>
          <span className="text-xs text-neutral-400 capitalize">
            {role}
          </span>
        </div>

        {/* ARROW */}
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            open ? "rotate-180" : ""
          } hidden sm:block`}
        />
      </button>

      {/* 🔽 DROPDOWN */}
      {open && (
        <div className="
          absolute right-0 mt-3 w-64
          rounded-2xl
          bg-neutral-950/90
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          overflow-hidden
          z-50
        ">

          {/* PROFILE */}
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-sm font-semibold text-white">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {email}
            </p>
            <p className="text-xs mt-1 text-indigo-400 capitalize">
              {role}
            </p>
          </div>

          {/* MENU */}
          <div className="py-1">

            {/* VIEW PROFILE */}
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="
                w-full flex items-center gap-3
                px-5 py-3 text-left
                hover:bg-white/5
                transition
              "
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-neutral-200">
                Profile
              </span>
            </button>

            {/* DIVIDER */}
            <div className="h-px bg-white/5 my-1" />

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="
                w-full flex items-center gap-3
                px-5 py-3 text-left
                hover:bg-red-500/10
                transition
              "
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">
                Logout
              </span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}