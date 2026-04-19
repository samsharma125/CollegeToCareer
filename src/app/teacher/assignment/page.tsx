"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateAssignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("A");

  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  // 🔥 NEW STATE (VIEW)
  const [myAssignments, setMyAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadSubjects();
    loadMyAssignments(); // ✅ load questions
  }, []);

  const loadSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*");
    setSubjects(data || []);
  };

  // 🔥 FETCH TEACHER QUESTIONS
  const loadMyAssignments = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("assignments")
      .select("*")
      .eq("teacher_id", userData.user.id)
      .order("created_at", { ascending: false });

    setMyAssignments(data || []);
  };

  const createAssignment = async () => {
    if (
      !title ||
      !subjectId ||
      !dueDate ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD
    ) {
      alert("⚠️ Fill all fields");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return alert("Login required");

    const { data, error } = await supabase
      .from("assignments")
      .insert([
        {
          title,
          description,
          subject_id: subjectId,
          teacher_id: userData.user.id,
          due_date: dueDate,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correct,
        },
      ])
      .select()
      .single();

    if (error) return alert(error.message);

    await supabase.from("notifications").insert({
      title: `📝 ${title} assignment uploaded`,
      type: "assignment",
      reference_id: data?.id,
      student_id: null,
    });

    alert("✅ Assignment Created");

    // 🔥 RESET
    setTitle("");
    setDescription("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setDueDate("");
    setSubjectId("");

    // 🔥 REFRESH LIST
    loadMyAssignments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Create Assignment
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Design and assign questions to students
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">

          <input
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
          />

          <textarea
            placeholder="Enter Question"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "A", value: optionA, set: setOptionA },
              { label: "B", value: optionB, set: setOptionB },
              { label: "C", value: optionC, set: setOptionC },
              { label: "D", value: optionD, set: setOptionD },
            ].map((opt) => (
              <input
                key={opt.label}
                placeholder={`Option ${opt.label}`}
                value={opt.value}
                onChange={(e) => opt.set(e.target.value)}
                className="p-3 rounded-xl bg-neutral-900 border border-white/10"
              />
            ))}
          </div>

          <select
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10"
          >
            <option value="A">Correct: A</option>
            <option value="B">Correct: B</option>
            <option value="C">Correct: C</option>
            <option value="D">Correct: D</option>
          </select>

          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10"
          />

          <button
            onClick={createAssignment}
            className="w-full py-3 rounded-xl bg-indigo-500"
          >
            Create Assignment
          </button>
        </div>

        {/* 🔥 MY QUESTIONS */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold mb-4">
            📚 My Questions
          </h3>

          {myAssignments.length === 0 && (
            <p className="text-gray-400">No assignments yet</p>
          )}

          <div className="space-y-4">
            {myAssignments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl bg-neutral-900 border border-white/10"
              >
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-gray-400">{a.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <p>🅰 {a.option_a}</p>
                  <p>🅱 {a.option_b}</p>
                  <p>🅲 {a.option_c}</p>
                  <p>🅳 {a.option_d}</p>
                </div>

                <p className="text-xs text-indigo-400 mt-2">
                  ✅ Correct: {a.correct_answer}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}







