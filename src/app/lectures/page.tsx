"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function LecturesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");

      console.log(data, error);
      setCourses(data || []);
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 text-white">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">📘 Choose Subject</h1>
      <p className="text-gray-400 mb-8">
        Start learning lectures by subject
      </p>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <p className="text-gray-400">No courses available</p>
      ) : (
        
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              {/* ICON */}
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg mb-4">
                <BookOpen size={20} />
              </div>

              {/* TITLE */}
              <h2 className="text-xl font-semibold mb-1">
                {course.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-sm mb-4">
                {course.description || "Learn this subject step by step"}
              </p>

              {/* OPEN BUTTON */}
              <button
                onClick={() => router.push(`/lectures/${course.id}`)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                Open →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}