"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { User, Mail, BarChart3, FileText, History } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq("id", id)
        .single();

      if (!error) {
        setStudent(data);
      }

      setLoading(false);
    };

    if (id) loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-gray-400">
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-red-400">
        Student not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Profile
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage student details and actions
          </p>
        </div>

        {/* 🔥 PROFILE CARD */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-hidden">
          
          {/* GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="relative flex items-center gap-5">
            {/* AVATAR */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>

            {/* INFO */}
            <div>
              <p className="text-xl font-semibold">
                {student.name}
              </p>

              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Mail className="w-4 h-4" />
                {student.email}
              </div>

              <p className="text-xs mt-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent capitalize">
                {student.role}
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Assign Work",
              icon: FileText,
            },
            {
              title: "View Marks",
              icon: BarChart3,
            },
            {
              title: "Activity History",
              icon: History,
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:border-indigo-500/40"
              >
                {/* GLOW */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition" />

                <div className="relative flex flex-col gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <p className="font-medium text-lg">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    Click to manage {item.title.toLowerCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}