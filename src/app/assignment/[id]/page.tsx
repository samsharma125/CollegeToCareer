"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

// 📊 GRAPH
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AssignmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState(600);
  const [startTimer, setStartTimer] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showOverall, setShowOverall] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);

  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>({});

  // INIT
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id;

    if (!uid) {
      alert("Login required");
      return;
    }

    setUserId(uid);
  };

  // START TEST
  const startTest = async () => {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("subject_id", id);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      alert("No questions available");
      return;
    }

    setQuestions(data);
    setTestStarted(true);
    setStartTimer(true);
    setShowOverall(false);
  };

  // TIMER
  useEffect(() => {
    if (!startTimer || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTimer, submitted]);

  // SELECT
  const handleSelect = (qid: string, option: string) => {
    if (submitted) return;

    setAnswers((prev: any) => ({
      ...prev,
      [qid]: option,
    }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (submitted) return;

    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    await supabase.from("student_results").insert({
      student_id: userId,
      subject_id: id,
      score: correct,
      total: questions.length,
    });
  };

  // 📈 FETCH OVERALL
  const fetchOverallAttempts = async () => {
    const { data, error } = await supabase
      .from("student_results")
      .select("*")
      .eq("student_id", userId)
      .eq("subject_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setAttemptHistory(data || []);
  };

  // 🧠 AI REVIEW (REAL AI CALL)
  const generateAIReview = async () => {
    setAiLoading(true);

    const result: any = {};

    for (const q of questions) {
      const userAns = answers[q.id];
      const correctAns = q.correct_answer;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: q.description,
            options: {
              A: q.option_a,
              B: q.option_b,
              C: q.option_c,
              D: q.option_d,
            },
            userAnswer: userAns,
            correctAnswer: correctAns,
          }),
        });

        const data = await res.json();

        result[q.id] = {
          user: userAns,
          correct: correctAns,
          explanation: data.explanation || "No explanation",
        };
      } catch (err) {
        result[q.id] = {
          user: userAns,
          correct: correctAns,
          explanation: "⚠️ AI error. Try again.",
        };
      }
    }

    setAiData(result);
    setAiLoading(false);
  };

  // TIME FORMAT
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 📊 ACCURACY
  const accuracy =
    score !== null && questions.length > 0
      ? (score / questions.length) * 100
      : 0;

  // GRAPH DATA
  const graphData = questions.map((q, index) => ({
    name: `Q${index + 1}`,
    score: answers[q.id] === q.correct_answer ? 1 : 0,
  }));

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-6">
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold text-center">
        📝 MCQ Test
      </h1>

      {/* START */}
      {!testStarted && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={startTest}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            ▶ Start Test
          </button>

          <button
            onClick={() => {
              fetchOverallAttempts();
              setShowOverall(!showOverall);
            }}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            📈 Overall
          </button>
        </div>
      )}

      {/* TIMER */}
      {testStarted && !submitted && (
        <div className="text-center text-red-400 font-semibold">
          ⏱ {formatTime(timeLeft)}
        </div>
      )}

      {/* QUESTIONS */}
      {testStarted &&
        questions.map((q, index) => (
          <div
            key={q.id}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="mb-3">
              Q{index + 1}. {q.description}
            </p>

            {["A", "B", "C", "D"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(q.id, opt)}
                className={`block w-full mt-2 p-3 rounded-xl text-left ${
                  answers[q.id] === opt
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {opt}. {q[`option_${opt.toLowerCase()}`]}
              </button>
            ))}
          </div>
        ))}

      {/* SUBMIT */}
      {testStarted && !submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          Submit Test
        </button>
      )}

      {/* RESULT */}
      {submitted && (
        <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          🎯 Score: {score} / {questions.length}
        </div>
      )}

      {/* BUTTONS */}
      {submitted && (
        <div className="flex flex-wrap gap-3 mt-6">

          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setScore(null);
              setTimeLeft(600);
              setStartTimer(true);
              setShowAnalysis(false);
              setShowAIReview(false);
            }}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            🔁 Re-attempt
          </button>

          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            📊 Analysis
          </button>

          <button
            onClick={() => {
              setShowAIReview(!showAIReview);
              if (!showAIReview) generateAIReview();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            🧠 AI Review
          </button>

        </div>
      )}

      {/* 📊 ANALYSIS */}
      {showAnalysis && (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10">

          <p className="mb-3 text-gray-300">
            Accuracy: {accuracy.toFixed(1)}%
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={graphData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line dataKey="score" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

        </div>
      )}

      {/* 🧠 AI REVIEW */}
      {showAIReview && (
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10">

          {aiLoading && (
            <p className="text-gray-400">
              🤖 Generating AI explanations...
            </p>
          )}

          {!aiLoading &&
            questions.map((q, i) => {
              const r = aiData[q.id];
              if (!r) return null;

              return (
                <div key={q.id} className="mb-5 border-b pb-3 border-white/10">
                  <p className="font-semibold">
                    Q{i + 1}. {q.description}
                  </p>

                  <p className="text-sm text-gray-400">
                    Your Answer:{" "}
                    <span className="text-indigo-400">{r.user}</span>
                  </p>

                  <p className="text-sm text-green-400">
                    Correct: {r.correct}
                  </p>

                  <p className="mt-2 text-gray-200 text-sm">
                    💡 {r.explanation}
                  </p>
                </div>
              );
            })}

        </div>
      )}

    </div>
  </div>
);
}