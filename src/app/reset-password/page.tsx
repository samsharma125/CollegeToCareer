"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully ✅");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md border border-neutral-800">
        <h2 className="text-white text-xl font-semibold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 mb-4 rounded bg-neutral-800 text-white border border-neutral-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}