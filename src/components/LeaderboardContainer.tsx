"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Types
type User = {
  id: string;
  name: string;
  total_points: number;
};

interface Props {
  userId: string;
}

export default function LeaderboardContainer({ userId }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myPoints, setMyPoints] = useState<number>(0);
  const [nextPoints, setNextPoints] = useState<number | null>(null); // 🔥 new

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, total_points")
      .order("total_points", { ascending: false });

    if (error || !data) return;

    const allUsers = data as User[];

    const top10 = allUsers.slice(0, 10);

    const currentUser = allUsers.find((u) => u.id === userId);
    const rank = allUsers.findIndex((u) => u.id === userId) + 1;

    setUsers(top10);
    setMyRank(rank > 0 ? rank : null);
    setMyPoints(currentUser?.total_points || 0);

    // 🔥 PROGRESS LOGIC
    if (rank > 1) {
      const aboveUser = allUsers[rank - 2];
      const diff = aboveUser.total_points - (currentUser?.total_points || 0);
      setNextPoints(diff);
    } else {
      setNextPoints(null);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchLeaderboard();

    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="space-y-6">

      {/* 👤 MY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-xs text-gray-400">Your Points</p>
          <p className="text-xl sm:text-2xl font-semibold mt-1">
            {myPoints}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-xs text-gray-400">Rank</p>
          <p className="text-xl sm:text-2xl font-semibold mt-1">
            {myRank ? `#${myRank}` : "-"}
          </p>
        </div>
      </div>

      {/* 🔥 PROGRESS CARD */}
      {nextPoints !== null && (
        <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-4 text-sm text-center">
          🚀 You need <span className="font-bold">{nextPoints}</span> points to reach next rank
        </div>
      )}

      {/* 🏆 PODIUM */}
      <div className="flex justify-center items-end gap-3 sm:gap-6 flex-wrap">

        {top3[0] && (
          <div className="flex flex-col items-center order-1 sm:order-2">
            <div className="bg-yellow-400 text-black px-3 sm:px-5 py-4 sm:py-8 rounded-xl font-bold text-sm sm:text-base">
              🥇 {top3[0].name}
            </div>
            <p className="text-xs sm:text-sm mt-1">
              {top3[0].total_points} pts
            </p>
          </div>
        )}

        {top3[1] && (
          <div className="flex flex-col items-center order-2 sm:order-1">
            <div className="bg-gray-300 text-black px-3 sm:px-4 py-3 sm:py-6 rounded-xl text-sm sm:text-base">
              🥈 {top3[1].name}
            </div>
            <p className="text-xs sm:text-sm mt-1">
              {top3[1].total_points} pts
            </p>
          </div>
        )}

        {top3[2] && (
          <div className="flex flex-col items-center order-3">
            <div className="bg-orange-400 text-black px-3 sm:px-4 py-3 sm:py-6 rounded-xl text-sm sm:text-base">
              🥉 {top3[2].name}
            </div>
            <p className="text-xs sm:text-sm mt-1">
              {top3[2].total_points} pts
            </p>
          </div>
        )}

      </div>

      {/* 📋 LIST */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          🏆 Leaderboard
        </h3>

        {others.map((user, index) => {
          const rank = index + 4;
          const isCurrentUser = user.id === userId;

          return (
            <div
              key={user.id}
              className={`flex justify-between items-center p-3 rounded-lg mb-2 text-sm sm:text-base ${
                isCurrentUser ? "bg-green-600" : "bg-gray-800"
              }`}
            >
              <span className="truncate">
                #{rank} {user.name}
              </span>
              <span className="text-xs sm:text-sm">
                {user.total_points} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}