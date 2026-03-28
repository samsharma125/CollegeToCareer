"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

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
      <div className="p-8 text-neutral-400">
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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        👤 Student Profile
      </h1>

      {/* Student Info Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
        <p className="text-xl font-semibold">{student.name}</p>
        <p className="text-neutral-400 mt-1">{student.email}</p>
        <p className="text-sm text-blue-400 mt-2 capitalize">
          Role: {student.role}
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
          📝 Assign Work
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
          📊 View Marks
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
          📁 Activity History
        </div>
      </div>
    </div>
  );
}
