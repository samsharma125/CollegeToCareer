"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackCarousel from "@/components/FeedbackCarousel";

export default function FeedbackPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white p-8">

      <h1 className="text-3xl font-bold text-center mb-10">
        Feedback Section 💬
      </h1>

      {/* ✅ FORM */}
      <div className="max-w-xl mx-auto mb-12">
        {user && <FeedbackForm user={user} />}
      </div>

      {/* ✅ CAROUSEL */}
      {/* <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <FeedbackCarousel />
      </div> */}

    </div>
  );
}