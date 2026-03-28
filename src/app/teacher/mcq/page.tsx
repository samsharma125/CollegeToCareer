"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MCQPage() {
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [time, setTime] = useState(600); // 10 minutes

  useEffect(() => {
    loadMCQ();

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitAnswers();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadMCQ = async () => {
    const { data } = await supabase
      .from("mcq_assignments")
      .select("*");

    setMcqs(data || []);
  };

  const submitAnswers = async () => {
    const user = await supabase.auth.getUser();
    const studentId = user.data.user?.id;

    for (let mcq of mcqs) {
      const selected = answers[mcq.id];

      await supabase.from("student_mcq_answers").insert({
        student_id: studentId,
        assignment_id: mcq.id,
        selected_answer: selected,
        is_correct: selected === mcq.correct_answer,
      });
    }

    alert("Submitted ✅");
  };

  return (
    <div className="p-6 text-white">
      <h1>MCQ Test</h1>

      <p className="text-red-400">
        Time Left: {Math.floor(time / 60)}:{time % 60}
      </p>

      {mcqs.map((q) => (
        <div key={q.id} className="mb-4 bg-gray-800 p-3 rounded">
          <h2>{q.question}</h2>

          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q.id}
                onChange={() =>
                  setAnswers({ ...answers, [q.id]: opt })
                }
              />
              {q[`option_${opt.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submitAnswers}
        className="bg-green-600 px-4 py-2"
      >
        Submit
      </button>
    </div>
  );
}