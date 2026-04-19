"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

export default function PerformanceCharts() {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // 🔥 GET USER
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;

    // =========================
    // 🔥 FETCH POINT HISTORY (MAIN SOURCE)
    // =========================
    const { data, error } = await supabase
      .from("points_history")
      .select("points, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) {
      setLoading(false);
      return;
    }

    // =========================
    // 📈 WEEKLY PERFORMANCE
    // =========================
    const weeklyMap: any = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    data.forEach((item: any) => {
      const day = new Date(item.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (weeklyMap[day] !== undefined) {
        weeklyMap[day] += item.points || 0;
      }
    });

    const weeklyFormatted = Object.keys(weeklyMap).map((day) => ({
      name: day,
      score: weeklyMap[day],
    }));

    setPerformanceData(weeklyFormatted);

    // =========================
    // 📊 SUBJECT DATA (FAKE SPLIT FROM POINTS)
    // (Until you have subject-based tracking)
    // =========================
    const subjectFormatted = [
      { subject: "Practice", marks: weeklyFormatted.reduce((a, b) => a + b.score, 0) * 0.4 },
      { subject: "Assignments", marks: weeklyFormatted.reduce((a, b) => a + b.score, 0) * 0.35 },
      { subject: "Tests", marks: weeklyFormatted.reduce((a, b) => a + b.score, 0) * 0.25 },
    ];

    setSubjectData(subjectFormatted);

    setLoading(false);
  };

  // ⏳ Loading
  if (loading) {
    return (
      <p className="text-gray-400 text-center">
        Loading charts...
      </p>
    );
  }

  // ❌ No data
  if (!performanceData.length) {
    return (
      <p className="text-red-400 text-center">
        No chart data available
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* 📈 LINE CHART */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">
          📈 Weekly Points
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">
          📊 Activity Breakdown
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={subjectData}>
            <XAxis dataKey="subject" stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="marks" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📉 AREA CHART */}
      <div className="md:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">
          📉 Growth Trend
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={performanceData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}