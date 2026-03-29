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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message);
      }

      const userId = data.user.id;

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          name,
          email,
          role,
        });

      if (profileError) throw profileError;

      if (role === "student") {
        await supabase.from("notifications").insert({
          title: `👨‍🎓 ${name} joined the platform`,
          type: "student_signup",
          reference_id: userId,
          student_id: null,
          is_read: false,
        });
      }

      alert("Account created successfully ✅");
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-4 relative overflow-hidden">

    {/* Background Glow Effects */}
    <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
    <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

    {/* Card */}
    <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Create Account 🚀
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Join UnivSync platform``
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-5">

        {/* Name */}
        <div>
          <label className="text-sm text-neutral-400">Full Name</label>
          <input
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-neutral-400">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Role Toggle */}
        <div>
          <label className="text-sm text-neutral-400 mb-2 block">
            Select Role
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRole("student")}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                role === "student"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-transparent shadow-md"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              👨‍🎓 Student
            </button>

            <button
              onClick={() => setRole("teacher")}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                role === "teacher"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 border-transparent shadow-md"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              👩‍🏫 Teacher
            </button>
          </div>
        </div>

        {/* Secret Field */}
        {role === "teacher" && (
          <div className="animate-fadeIn">
            <label className="text-sm text-neutral-400">
              Teacher Secret Code
            </label>
            <input
              placeholder="Enter secret code"
              onChange={(e) => setSecret(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full mt-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold text-white shadow-lg shadow-blue-500/20"
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-neutral-400 mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-400 hover:text-blue-300 transition font-medium"
        >
          Login
        </a>
      </p>
    </div>
  </div>
);
}