"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">👨‍🎓 Student List</h1>

      {/* Search */}
      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded bg-neutral-800 border border-neutral-700"
      />

      {/* Content */}
      {loading ? (
        <p className="text-neutral-400">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-neutral-400">No students found.</p>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/teacher/students/${student.id}`}
              className="block p-4 rounded bg-neutral-900 border border-neutral-800 hover:border-blue-500 transition"
            >
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-neutral-400">{student.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
