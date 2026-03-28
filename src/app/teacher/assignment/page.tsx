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
    const { data, error } = await supabase.from("subjects").select("*");

    if (error) {
      console.error("Subjects error:", error);
    } else {
      setSubjects(data || []);
    }
  };

  const createAssignment = async () => {
    // ✅ Validation
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

    // ✅ Check logged-in user
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      alert("❌ You must be logged in");
      return;
    }

    const teacherId = userData.user.id;

    // ✅ INSERT ASSIGNMENT
    const { data, error } = await supabase
      .from("assignments")
      .insert([
        {
          title,
          description,
          subject_id: subjectId,
          teacher_id: teacherId,
          due_date: dueDate,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correct,
        },
      ])
      .select()
      .single(); // 🔥 IMPORTANT

    console.log("INSERT DATA:", data);
    console.log("INSERT ERROR:", error);

    if (error) {
      alert(`❌ Error: ${error.message}`);
      return;
    }

    // 🔔 ==========================
    // NOTIFICATION (🔥 MAIN FIX)
    // ==========================
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        title: `📝 ${title} assignment uploaded`,
        type: "assignment",
        reference_id: data?.id,
        student_id: null, // 🔥 FOR ALL STUDENTS
      });

    console.log("NOTIFICATION ERROR:", notifError);

    alert("✅ Assignment Created Successfully");

    // ✅ Reset form
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
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 w-full rounded"
      />

      <textarea
        placeholder="Question"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 w-full rounded"
      />

      <input
        placeholder="Option A"
        value={optionA}
        onChange={(e) => setOptionA(e.target.value)}
        className="block mb-2 p-2 bg-gray-800 w-full rounded"
      />

      <input
        placeholder="Option B"
        value={optionB}
        onChange={(e) => setOptionB(e.target.value)}
        className="block mb-2 p-2 bg-gray-800 w-full rounded"
      />

      <input
        placeholder="Option C"
        value={optionC}
        onChange={(e) => setOptionC(e.target.value)}
        className="block mb-2 p-2 bg-gray-800 w-full rounded"
      />

      <input
        placeholder="Option D"
        value={optionD}
        onChange={(e) => setOptionD(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 w-full rounded"
      />

      <select
        value={correct}
        onChange={(e) => setCorrect(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 w-full rounded"
      >
        <option value="A">Correct: A</option>
        <option value="B">Correct: B</option>
        <option value="C">Correct: C</option>
        <option value="D">Correct: D</option>
      </select>

      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="block mb-3 p-2 bg-gray-800 w-full rounded"
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
        className="block mb-4 p-2 bg-gray-800 w-full rounded"
      />

      <button
        onClick={createAssignment}
        className="bg-blue-600 px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Create Assignment
      </button>
    </div>
  );
}