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

export default function StudyPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("subjects")
      .select("*");

    setSubjects(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-black to-purple-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            📚 Your Subjects
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Explore your learning materials
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-400">Loading subjects...</p>
        )}

        {/* EMPTY */}
        {!loading && subjects.length === 0 && (
          <p className="text-gray-400">No subjects found</p>
        )}

        {/* SUBJECT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/study/${subject.id}`}>
              <div className="
                group relative p-6 rounded-2xl
                bg-gradient-to-br from-indigo-500/20 to-purple-500/20
                border border-white/10
                hover:scale-[1.04]
                transition-all duration-300
                cursor-pointer
              ">

                {/* GLOW */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition rounded-2xl" />

                {/* ICON */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>

                {/* TEXT */}
                <h2 className="text-lg font-semibold">
                  {subject.name}
                </h2>

                <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                  {subject.description || "No description"}
                </p>

                {/* CTA */}
                <p className="text-xs mt-4 text-indigo-400">
                  Click to explore →
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}