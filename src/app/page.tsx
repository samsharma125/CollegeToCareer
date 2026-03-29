"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 text-white">
      <h1 className="text-4xl font-bold">CollegeToCareer🎓</h1>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-4 py-2 bg-gray-800 rounded"
        >
          Signup
        </button>
      </div>
    </main>
  );
}
