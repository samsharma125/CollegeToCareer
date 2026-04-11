"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LeaderboardContainer from "@/components/LeaderboardContainer";

export default function LeaderboardPage() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      <LeaderboardContainer userId={userId} />
    </div>
  );
}