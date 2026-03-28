"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const TEACHER_SECRET = "UNIVSYNC_TEACHER_2025";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSignup = async () => {
  if (!email || !password || !name) {
    alert("All fields are required");
    return;
  }

  if (role === "teacher" && secret !== TEACHER_SECRET) {
    alert("Invalid teacher secret code");
    return;
  }

  setLoading(true);

  try {
    // 🔹 Signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message);
    }

    const userId = data.user.id;

    // 🔹 Insert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        name,
        email,
        role,
      });

    if (profileError) throw profileError;

    // 🔔 ==========================
    // ONLY IF STUDENT → NOTIFY TEACHER
    // ==========================
    if (role === "student") {
      const { error: notifError } = await supabase
        .from("notifications")
        .insert({
          title: `👨‍🎓 ${name} joined the platform`,
          type: "student_signup",
          reference_id: userId,
          student_id: null,
          is_read: false,
        });

      if (notifError) {
        console.error("Notification error:", notifError);
      }
    }

    alert("Account created successfully ✅");
    router.push("/login");

  } catch (err: any) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-8 border border-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {role === "teacher" && (
          <input
            className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
            placeholder="Teacher Secret Code"
            onChange={(e) => setSecret(e.target.value)}
          />
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}