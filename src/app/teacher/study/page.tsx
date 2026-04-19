"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, FileText } from "lucide-react";

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

  useEffect(() => {
    const loadSubjects = async () => {
      const { data } = await supabase
        .from("subjects")
        .select("id, name");

      setSubjects(data || []);
    };

    loadSubjects();
  }, []);

  const handleUpload = async () => {
    if (!subjectId || !title) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    let fileUrl: string | null = null;

    try {
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

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("study-materials")
          .getPublicUrl(filePath);

        fileUrl = data.publicUrl;
      }

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

      if (error) throw error;

      await supabase.from("notifications").insert({
        title: `📂 ${title} uploaded`,
        type: "material",
        reference_id: material?.id,
        student_id: null,
      });

      alert("Uploaded successfully ✅");

      setTitle("");
      setFile(null);
      setQuestion("");
      setSubjectId("");

    } catch (err: any) {
      alert(err.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Upload Study Material
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Share resources with your students
          </p>
        </div>

        {/* FORM CARD */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-5">
          
          {/* GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          {/* SUBJECT */}
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="relative w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* TITLE */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
          />

          {/* TYPE SELECTOR */}
          <div className="flex gap-3">
            {["pdf", "question"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={`flex-1 py-2 rounded-xl border transition ${
                  type === t
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* PDF UPLOAD */}
          {type === "pdf" && (
            <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-dashed border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 transition">
              <UploadCloud className="w-6 h-6 text-indigo-400" />
              <p className="text-sm text-gray-400">
                {file ? file.name : "Click to upload PDF"}
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}

          {/* QUESTION */}
          {type === "question" && (
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter practice question..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
            />
          )}

          {/* BUTTON */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg"
          >
            {loading ? "Uploading..." : "Upload Material"}
          </button>
        </div>
      </div>
    </div>
  );
}