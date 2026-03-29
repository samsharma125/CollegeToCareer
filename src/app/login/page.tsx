"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-4 relative overflow-hidden">

    {/* Background Glow Effects */}
    <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
    <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

    {/* Card */}
    <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Login to your account
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-neutral-400">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-neutral-900/70 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right text-sm">
          <a
            href="/forgot-password"
            className="text-green-400 hover:text-green-300 transition"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-semibold text-white shadow-lg shadow-green-500/20"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-neutral-700"></div>
        <span className="px-3 text-sm text-neutral-500">OR</span>
        <div className="flex-1 h-px bg-neutral-700"></div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-neutral-400">
        Don’t have an account?{" "}
        <a
          href="/signup"
          className="text-green-400 hover:text-green-300 transition font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
);
}