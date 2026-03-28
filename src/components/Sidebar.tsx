"use client";

import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64
        bg-neutral-900 border-r border-neutral-800 p-6
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-bold mb-6">
          UnivSync<span className="text-blue-400">AI</span>
        </h2>

       <nav className="flex flex-col gap-4 text-sm">
  <Link href="/dashboard" onClick={close}>
    Dashboard
  </Link>

  {role?.toLowerCase() === "student" && (
    <>
      <Link href="/study" onClick={close}>
        Study Materials
      </Link>
      <Link href="/ai" onClick={close}>
        AI Assistant
      </Link>
      <Link href="/assignment" onClick={close}>
        Assignments
      </Link>
      <Link href="/resume-builder" onClick={close}>
        Resume Builder
      </Link>
    </>
  )}

  {role?.toLowerCase() === "teacher" && (
    <>
      <Link href="/teacher/study" onClick={close}>
        Upload Study Material
      </Link>
      <Link href="/teacher/students" onClick={close}>
        Students
      </Link>
      <Link href="/teacher/assignment" onClick={close}>
        Create New Assignment
      </Link>
       <Link href="/assignment" onClick={close}>
        Created Assignment
      </Link>

    </>
  )}
</nav>

      </aside>
    </>
  );
}
