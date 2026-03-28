"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

// ICONS
import { Bell, Users, FileText, BookOpen, Plus } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { open } = useSidebar();

  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  // 🔥 REAL DATA STATES
  const [studentCount, setStudentCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      const userId = data.user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", userId)
        .single();

      const userRole = profile?.role || "";

      setRole(userRole);
      setName(profile?.name || "");

      // 🔥 FETCH REAL DATA FOR TEACHER
      if (userRole === "teacher") {
        fetchTeacherData(userId);
      }
    };

    load();
  }, [router]);

  // 🚀 FETCH ALL DASHBOARD DATA
  const fetchTeacherData = async (userId: string) => {
    // 👨‍🎓 STUDENTS COUNT
    const { count: students } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    setStudentCount(students || 0);

    // 📄 ASSIGNMENTS COUNT
    const { count: assignments } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", userId);

    setAssignmentCount(assignments || 0);

    // 📚 MATERIALS COUNT
    const { count: materials } = await supabase
      .from("materials")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", userId);

    setMaterialCount(materials || 0);

    // 📥 RECENT SUBMISSIONS
    const { data: submissions } = await supabase
      .from("submissions")
      .select(`
        id,
        created_at,
        assignments(title),
        profiles(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentSubmissions(submissions || []);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      <Sidebar />

      <div className="flex-1">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
          <h1 className="text-lg font-semibold">
            Welcome back, <span className="text-indigo-400">{name}</span> 👋
          </h1>

          <span className="px-3 py-1 text-sm rounded-full bg-neutral-800 text-neutral-300">
            {role.toUpperCase()}
          </span>
        </header>

        {/* Content */}
        <main className="p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-neutral-400 text-sm">
              Manage your account and view insights
            </p>
          </div>

          {/* 🔥 TEACHER DASHBOARD */}
          {role === "teacher" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
  { title: "Students", value: studentCount, icon: Users, link: "/teacher/students" },
  { title: " Uploaded Assignments", value: assignmentCount, icon: FileText, link: "/assignment" },
  { title: "Uploaded Stuidy Materials", value: materialCount, icon: BookOpen, link: "/study" },
].map((item, i) => {
  const Icon = item.icon;

  return (
    <div
      key={i}
      onClick={() => router.push(item.link)} // 🔥 REDIRECT
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4 hover:bg-neutral-800 transition cursor-pointer active:scale-[0.98]"
    >
      <div className="p-3 bg-neutral-800 rounded-lg">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-sm text-gray-400">{item.title}</p>
        <p className="text-xl font-semibold">{item.value}</p>
      </div>
    </div>
  );
})}
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4" >Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {["Create Assignment", "Upload Material"].map(
                    (text, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
                      >
                        <Plus size={16} /> {text}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* RECENT SUBMISSIONS */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Submissions</h3>

                <div className="space-y-3">
                  {recentSubmissions.length === 0 && (
                    <p className="text-gray-400 text-sm">No submissions yet</p>
                  )}

                  {recentSubmissions.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-neutral-800"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {s.profiles?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.assignments?.title || "Assignment"}
                        </p>
                      </div>

                      <span className="text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 🎓 STUDENT DASHBOARD */}
          {role === "student" && (
            <div className="text-gray-400">Student dashboard coming soon...</div>
          )}
        </main>
      </div>
    </div>
  );
}
