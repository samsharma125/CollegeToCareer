"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
    const { data, error } = await supabase
      .from("subjects")
      .select("*");

    console.log("Subjects:", data, error);

    if (error) {
      console.error("Error:", error.message);
    } else {
      setSubjects(data || []);
    }

    setLoading(false);
  };

  // 🔥 Loading state
  if (loading) {
    return (
      <div className="text-white p-6 text-center">
        Loading subjects...
      </div>
    );
  }

  // 🔥 No data
  if (subjects.length === 0) {
    return (
      <div className="text-white p-6 text-center">
        No subjects found
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📘 Select Subject
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/assignment/${subject.id}`}
            className="p-6 bg-gray-900 border border-gray-700 rounded-xl hover:border-blue-500 hover:scale-105 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">
              {subject.name}
            </h2>

            <p className="text-sm text-gray-400">
              {subject.description || "No description"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}