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

  // ✅ Close on outside click
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

  return (
    <div ref={menuRef} className="relative">
      
      {/* 🔥 PREMIUM PROFILE BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-xl
          bg-neutral-900/80
          border border-neutral-700
          hover:bg-neutral-800
          hover:border-neutral-600
          transition-all duration-200
          backdrop-blur
        "
      >
        {/* 👤 Avatar */}
        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
          <User className="w-4 h-4 text-neutral-300" />
        </div>

        {/* 🖥 Desktop Info */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-medium text-white">
            {name || "User"}
          </span>
          <span className="text-xs text-neutral-400 capitalize">
            {role}
          </span>
        </div>

        {/* ⬇ Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            open ? "rotate-180" : ""
          } hidden sm:block`}
        />
      </button>

      {/* 🔽 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-900/95 backdrop-blur border border-neutral-700 shadow-2xl z-50 overflow-hidden">
          
          {/* Profile Info */}
          <div className="px-4 py-3 border-b border-neutral-800">
            <p className="font-semibold text-white">{name || "User"}</p>
            <p className="text-sm text-neutral-400 truncate">{email}</p>
            <p className="text-xs mt-1 text-blue-400 capitalize">
              {role}
            </p>
          </div>

          {/* Logout */}
         <button
  onClick={() => {
    setOpen(false);
    router.push("/profile");
  }}
  className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-neutral-800 transition"
>
  <User className="w-4 h-4" />
  View Profile
</button>

{/* Logout */}
<button
  onClick={logout}
  className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-red-600/80 transition"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>
        </div>
      )}
    </div>
  );
}