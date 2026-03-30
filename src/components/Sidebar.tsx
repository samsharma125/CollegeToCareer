"use client";

import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

// ICONS
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  FileText,
  Upload,
  Users,
  PlusCircle,
} from "lucide-react";

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role ?? null);
    };

    loadRole();
  }, []);

  if (!role) return null;

  const linkStyle = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
     ${
       pathname === path
         ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
         : "hover:bg-white/10"
     }`;

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={close}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white/5 backdrop-blur-xl
          border-r border-white/10
          p-6
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <h2 className="
          text-xl font-bold mb-8 tracking-wide
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500
          bg-clip-text text-transparent
        ">
          CTC
        </h2>

        {/* NAV */}
        <nav className="flex flex-col gap-6 text-sm">

          {/* COMMON */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase px-2">General</p>

            <Link href="/dashboard" onClick={close} className={linkStyle("/dashboard")}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          {/* STUDENT */}
          {role?.toLowerCase() === "student" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase px-2">Learning</p>

              <Link href="/study" onClick={close} className={linkStyle("/study")}>
                <BookOpen size={16} />
                Study Materials
              </Link>

              <Link href="/ai" onClick={close} className={linkStyle("/ai")}>
                <Brain size={16} />
                AI Assistant
              </Link>

              <Link href="/assignment" onClick={close} className={linkStyle("/assignment")}>
                <FileText size={16} />
                Assignments
              </Link>

              <Link href="/resume-builder" onClick={close} className={linkStyle("/resume-builder")}>
                <FileText size={16} />
                Resume Builder
              </Link>
            </div>
          )}

          {/* TEACHER */}
          {role?.toLowerCase() === "teacher" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase px-2">Management</p>

              <Link href="/teacher/study" onClick={close} className={linkStyle("/teacher/study")}>
                <Upload size={16} />
                Upload Material
              </Link>

              <Link href="/teacher/students" onClick={close} className={linkStyle("/teacher/students")}>
                <Users size={16} />
                Students
              </Link>

              <Link href="/teacher/assignment" onClick={close} className={linkStyle("/teacher/assignment")}>
                <PlusCircle size={16} />
                Create Assignment
              </Link>

              <Link href="/assignment" onClick={close} className={linkStyle("/assignment")}>
                <FileText size={16} />
                Created Assignments
              </Link>
            </div>
          )}

        </nav>
      </aside>
    </>
  );
}