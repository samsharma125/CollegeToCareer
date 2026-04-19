"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { BookOpen } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  description: string;
};

export default function AssignmentSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from("subjects")
      .select("*");

    setSubjects(data || []);
    setLoading(false);
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gradient-to-br from-black via-neutral-950 to-black">
        Loading subjects...
      </div>
    );
  }

  // 🔥 EMPTY
  if (subjects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gradient-to-br from-black via-neutral-950 to-black">
        No subjects found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            📘 Choose Subject
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Start solving assignments by subject
          </p>
        </div>

        {/* SUBJECT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/assignment/${subject.id}`}
              className="
                group relative p-5 rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                hover:bg-white/10
                transition-all duration-300
              "
            >
              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition rounded-2xl" />

              {/* CONTENT */}
              <div className="relative">

                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold">
                  {subject.name}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {subject.description || "Start practicing now"}
                </p>

                {/* CTA */}
                <p className="text-xs mt-3 text-indigo-400">
                  Open →
                </p>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}