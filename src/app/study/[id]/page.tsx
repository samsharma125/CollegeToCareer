"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

type Material = {
  id: string;
  title: string;
  type: "pdf" | "question";
  file_url: string;
  content: string;
  created_at: string;
};

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params?.id as string;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) fetchMaterials();
  }, [subjectId]);

  const fetchMaterials = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("study_materials")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setMaterials(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            📂 Subject Materials
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            View all uploaded materials
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-400">Loading materials...</p>
        )}

        {/* EMPTY */}
        {!loading && materials.length === 0 && (
          <p className="text-gray-400">No materials found</p>
        )}

        {/* MATERIALS */}
        <div className="space-y-4">
          {materials.map((m) => (
            <div
              key={m.id}
              className="
                group relative p-5 rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                transition-all duration-300
                hover:bg-white/10
              "
            >
              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition rounded-2xl" />

              {/* TITLE */}
              <div className="relative">
                <h2 className="text-lg font-semibold">
                  {m.title}
                </h2>

                <p className="text-xs text-gray-400 mt-1 capitalize">
                  {m.type}
                </p>
              </div>

              {/* PDF */}
              {m.type === "pdf" && (
                <div className="relative mt-3">
                  <a
                    href={m.file_url}
                    target="_blank"
                    className="
                      inline-block px-4 py-2 rounded-lg
                      bg-gradient-to-r from-indigo-500 to-purple-600
                      hover:opacity-90 transition text-sm shadow-lg
                    "
                  >
                    📄 Open PDF
                  </a>
                </div>
              )}

              {/* QUESTION */}
              {m.type === "question" && (
                <div className="relative mt-3 p-4 rounded-xl bg-black/30 border border-white/10">
                  <p className="text-gray-300 text-sm">
                    {m.content}
                  </p>
                </div>
              )}

              {/* DATE */}
              <p className="text-xs text-gray-500 mt-4">
                {new Date(m.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}