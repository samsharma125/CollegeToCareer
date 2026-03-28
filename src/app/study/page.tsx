"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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

    const { data, error } = await supabase
      .from("subjects")
      .select("*");

    if (error) {
      console.error("Error fetching subjects:", error);
    } else {
      console.log("Subjects:", data);
      setSubjects(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        📚 Study Subjects
      </h1>

      {/* Loading */}
      {loading && <p>Loading subjects...</p>}

      {/* No Data */}
      {!loading && subjects.length === 0 && (
        <p className="text-gray-400">No subjects found</p>
      )}

      {/* Subjects List */}
      <div className="grid gap-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/study/${subject.id}`}
          >
            <div className="p-5 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer shadow-md">
              
              <h2 className="text-lg font-semibold">
                {subject.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {subject.description || "No description"}
              </p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}