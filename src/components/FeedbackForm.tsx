"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeedbackForm({ user }: any) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!message) return alert("Write something!");

    setLoading(true);

    const { error } = await supabase.from("feedbacks").insert([
      {
        user_id: user.id,
        name: user.user_metadata?.name || "Student",
        message,
        rating,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error submitting feedback");
    } else {
      setMessage("");
      alert("Feedback submitted 🚀");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4">
        Share Your Feedback 💬
      </h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white mb-4"
      />

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mb-4 p-2 rounded-lg bg-black/40 border border-white/10"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} ⭐
          </option>
        ))}
      </select>

      <button
        onClick={submitFeedback}
        disabled={loading}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}