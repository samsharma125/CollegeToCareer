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

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*");
    setSubjects(data || []);
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

    setTitle("");
    setDescription("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setDueDate("");
    setSubjectId("");
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
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
          
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          {/* TITLE */}
          <input
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
          />

          {/* QUESTION */}
          <textarea
            placeholder="Enter Question"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none"
          />

          {/* OPTIONS */}
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
                className={`p-3 rounded-xl border outline-none transition
                  ${
                    correct === opt.label
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-500 shadow-lg"
                      : "bg-gradient-to-br from-neutral-900 to-neutral-800 border-white/10 hover:border-indigo-400 focus:border-indigo-500"
                  }
                `}
              />
            ))}
          </div>

          {/* CORRECT SELECT */}
          <select
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            className="
              w-full p-3 rounded-xl
              bg-gradient-to-br from-neutral-900 to-neutral-800
              border border-white/10
              text-white
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/30
              outline-none
              transition
              appearance-none cursor-pointer
            "
          >
            <option className="bg-neutral-900 text-white" value="A">Correct Answer: A</option>
            <option className="bg-neutral-900 text-white" value="B">Correct Answer: B</option>
            <option className="bg-neutral-900 text-white" value="C">Correct Answer: C</option>
            <option className="bg-neutral-900 text-white" value="D">Correct Answer: D</option>
          </select>

          {/* SUBJECT */}
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="
              w-full p-3 rounded-xl
              bg-gradient-to-br from-neutral-900 to-neutral-800
              border border-white/10
              text-white
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/30
              outline-none
              transition
              appearance-none cursor-pointer
            "
          >
            <option className="bg-neutral-900 text-white" value="">
              Select Subject
            </option>
            {subjects.map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="bg-neutral-900 text-white"
              >
                {s.name}
              </option>
            ))}
          </select>

          {/* DUE DATE */}
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 focus:border-indigo-500 outline-none"
          />

          {/* BUTTON */}
          <button
            onClick={createAssignment}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg"
          >
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
}