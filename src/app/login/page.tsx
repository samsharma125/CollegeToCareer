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

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-8 border border-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          className="w-full p-3 mb-3 rounded bg-neutral-800 border border-neutral-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded bg-green-600 hover:bg-green-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
