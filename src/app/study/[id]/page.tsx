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

    console.log("Subject ID:", subjectId);

    const { data, error } = await supabase
      .from("study_materials")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }); // 🔥 NEWEST FIRST

    console.log("Materials:", data, error);

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setMaterials(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        📂 Subject Materials
      </h1>

      {/* Loading */}
      {loading && <p>Loading materials...</p>}

      {/* No Data */}
      {!loading && materials.length === 0 && (
        <p className="text-gray-400">No materials found</p>
      )}

      {/* Materials */}
      {materials.map((m) => (
        <div
          key={m.id}
          className="p-5 bg-gray-900 mb-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold">
            {m.title}
          </h2>

          {/* PDF */}
          {m.type === "pdf" && (
            <a
              href={m.file_url}
              target="_blank"
              className="text-blue-400 underline mt-2 inline-block"
            >
              📄 Open PDF
            </a>
          )}

          {/* Question */}
          {m.type === "question" && (
            <p className="mt-2 text-gray-300">
              {m.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}