"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("student_results")
      .select(`
        score,
        total,
        student_id,
        profiles(name)
      `)
      .order("score", { ascending: false });

    console.log(data, error);

    if (!error && data) {
      setData(data);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🏆 Leaderboard</h1>

      {data.map((user, index) => (
        <div
          key={index}
          className={`p-4 mb-3 rounded flex justify-between ${
            index === 0
              ? "bg-yellow-700"
              : index === 1
              ? "bg-gray-500"
              : index === 2
              ? "bg-orange-700"
              : "bg-gray-900"
          }`}
        >
          <div>
            #{index + 1} - {user.profiles?.name || "User"}
          </div>

          <div>
            {user.score} / {user.total}
          </div>
        </div>
      ))}
    </div>
  );
}