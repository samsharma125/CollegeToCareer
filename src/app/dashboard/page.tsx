"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import PerformanceCharts from "@/components/PerformanceCharts";
import FeedbackCarousel from "@/components/FeedbackCarousel";

import { Users, FileText, BookOpen, Plus } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { open } = useSidebar();

  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  // 🔥 REAL DATA STATES
  const [myPoints, setMyPoints] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);

  const [studentCount, setStudentCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  useEffect(() => {
    let userId = "";

    const load = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      userId = data.user.id;

      // PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", userId)
        .single();

      const userRole = profile?.role || "";

      setRole(userRole);
      setName(profile?.name || "");

      // 🔥 FETCH LEADERBOARD DATA
      fetchLeaderboard(userId);

      if (userRole === "teacher") {
        fetchTeacherData(userId);
      }
    };

    load();

    // 🔥 REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel("realtime-leaderboard")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          // 🔥 only update if relevant
          fetchLeaderboard(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // 🔥 FUNCTION TO CALCULATE RANK + POINTS
  const fetchLeaderboard = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, total_points")
      .order("total_points", { ascending: false });

    if (!data) return;

    const rank =
      data.findIndex((u) => u.id === userId) + 1;

    const currentUser = data.find(
      (u) => u.id === userId
    );

    setMyRank(rank > 0 ? rank : null);
    setMyPoints(currentUser?.total_points || 0);
  };

  const fetchTeacherData = async (userId: string) => {
    const { count: students } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    setStudentCount(students || 0);

    const { count: assignments } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", userId);

    setAssignmentCount(assignments || 0);

    const { count: materials } = await supabase
      .from("materials")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", userId);

    setMaterialCount(materials || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white flex">
      <Sidebar />

      <div className="flex-1">
        {/* NAVBAR */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <h1 className="text-xl font-semibold">
            Welcome back,{" "}
            <span className="text-indigo-400">{name}</span> 👋
          </h1>

          <span className="px-4 py-1 text-xs rounded-full bg-white/10">
            {role.toUpperCase()}
          </span>
        </header>

        {/* CONTENT */}
        <main className="p-8 space-y-10">
  <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account and view insights
            </p>
          </div>

          {/* TEACHER DASHBOARD */}
          {role === "teacher" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Students",
                   
                    icon: Users,
                    link: "/teacher/students",
                  },
                  {
                    title: "Assignments",
                    icon: FileText,
                    link: "/assignment",
                  },
                  {
                    title: "Materials",
                    icon: BookOpen,
                    link: "/study",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={i}
                      onClick={() => router.push(item.link)}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-indigo-500/50"
                    >
                      {/* GLOW */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition"></div>

                      <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                          <Icon size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            {item.title}
                          </p>
                       
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* QUICK ACTIONS */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Quick Actions
                </h3>

             <div className="flex flex-wrap gap-4">
  {[
    { text: "Create Assignment", link: "/teacher/assignment" },
    { text: "Upload Material", link: "/teacher/study" },
  ].map((item, i) => (
    <button
      key={i}
      onClick={() => router.push(item.link)} // ✅ navigation added
      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg"
    >
      <Plus size={16} /> {item.text}
    </button>
  ))}
</div>
              </div>



              {/* RECENT SUBMISSIONS */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="font-semibold mb-4">
                  Recent Submissions
                </h3>

                <div className="space-y-3">
                  {recentSubmissions.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No submissions yet
                    </p>
                  )}

                  {recentSubmissions.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-4 rounded-xl hover:bg-white/5 transition"
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
                        {new Date(
                          s.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* 🔥 STUDENT DASHBOARD */}
          {role === "student" && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { title: "Your Points", value: myPoints },
                  { title: "Rank", value: myRank ? `#${myRank}` : "-" },
                  
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-xs text-gray-400">
                      {item.title}
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">
                  Performance Insights
                </h3>
                <PerformanceCharts />
              </div>
            </>
          )}

          {/* FEEDBACK */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              What Students Say 💬
            </h3>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <FeedbackCarousel />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}