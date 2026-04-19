"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        alert("Verification failed ❌");
        router.push("/login");
        return;
      }

      const user = data.session.user;

      // 🔐 CHECK EMAIL VERIFIED
      if (!user.email_confirmed_at) {
        alert("Email not verified ❌");
        router.push("/login");
        return;
      }

      // ✅ SUCCESS
      alert("Email verified successfully ✅");

      router.push("/dashboard");
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      Verifying your account...
    </div>
  );
}