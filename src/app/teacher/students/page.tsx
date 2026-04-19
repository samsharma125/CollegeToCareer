"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User, Search } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
};

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("role", "student");

      if (!error && data) {
        setStudents(data);
      }

      setLoading(false);
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student List
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and explore all students
          </p>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />

          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-3
              rounded-xl
              bg-white/5
              border border-white/10
              backdrop-blur-xl
              focus:outline-none
              focus:border-indigo-500
              transition
            "
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-gray-400 text-sm">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-gray-400 text-sm">
            No students found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Link
                key={student.id}
                href={`/teacher/students/${student.id}`}
                className="
                  group relative flex items-center gap-4
                  p-5 rounded-2xl
                  bg-white/5
                  border border-white/10
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:border-indigo-500/40
                "
              >
                {/* GLOW */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition" />

                {/* AVATAR */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>

                {/* INFO */}
                <div className="relative">
                  <p className="font-semibold text-white">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {student.email}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}