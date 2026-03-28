"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Subject = {
  id: string;
  name: string;
};

export default function TeacherStudyUpload() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"pdf" | "question">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("id, name");

      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        setSubjects(data || []);
      }
    };

    loadSubjects();
  }, []);

  // 🔹 Upload handler
  const handleUpload = async () => {
    if (!subjectId || !title) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    let fileUrl: string | null = null;

    try {
      // ==========================
      // PDF UPLOAD
      // ==========================
      if (type === "pdf") {
        if (!file) {
          alert("Please select a PDF file");
          setLoading(false);
          return;
        }

        const filePath = `${subjectId}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("study-materials")
          .upload(filePath, file);

        if (uploadError) {
          console.error("UPLOAD ERROR:", uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("study-materials")
          .getPublicUrl(filePath);

        fileUrl = data.publicUrl;
      }

      // ==========================
      // INSERT MATERIAL
      // ==========================
      const { data: material, error } = await supabase
        .from("study_materials")
        .insert({
          subject_id: subjectId,
          title,
          type,
          file_url: fileUrl,
          content: type === "question" ? question : null,
        })
        .select()
        .single();

      if (error) {
        console.error("DB ERROR:", error);
        throw error;
      }

      console.log("MATERIAL INSERTED:", material);

      // ==========================
      // 🔔 INSERT NOTIFICATION
      // ==========================
      const { error: notifError } = await supabase
        .from("notifications")
        .insert({
          title: `📂 ${title} uploaded`,
          type: "material",
          reference_id: material?.id,
          student_id: null, // 🔥 IMPORTANT
        });

      console.log("NOTIFICATION ERROR:", notifError);

      alert("Study material uploaded successfully ✅");

      // RESET
      setTitle("");
      setFile(null);
      setQuestion("");
      setSubjectId("");

    } catch (err: any) {
      console.error("FINAL ERROR:", err);
      alert(err.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">
        📤 Upload Study Material
      </h1>

      {/* Subject */}
      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
      />

      {/* Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "pdf" | "question")}
        className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
      >
        <option value="pdf">PDF</option>
        <option value="question">Practice Question</option>
      </select>

      {/* PDF */}
      {type === "pdf" && (
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full mb-4"
        />
      )}

      {/* Question */}
      {type === "question" && (
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter practice question"
          className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}