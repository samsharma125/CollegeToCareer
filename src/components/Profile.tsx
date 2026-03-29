"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");

  // 🔐 Password section toggle
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      setName(data?.name || "");
    }

    setLoading(false);
  };

  // 🔥 FIXED: Update name + instant UI update
  const updateProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error(error);
      alert("Update failed ❌");
      return;
    }

    // ✅ Instant UI update
    if (data && data.length > 0) {
      setProfile(data[0]);
      setName(data[0].name);
    }

    alert("Profile updated ✅");
    setEdit(false);
  };

  // 🔐 Update Password
  const updatePassword = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully ✅");

    setPassword("");
    setConfirmPassword("");
    setShowPasswordSection(false);
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!profile)
    return <p className="text-center mt-10 text-white">No profile found</p>;

  return (
   <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center px-4">
  <div className="w-full max-w-lg bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-8 transition-all">

    {/* 🔥 HEADER */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        {profile.name?.charAt(0)?.toUpperCase() || "U"}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {profile.name || "User"}
        </h2>
        <p className="text-sm text-neutral-400">{profile.email}</p>
        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md capitalize">
          {profile.role}
        </span>
      </div>
    </div>

    <div className="border-t border-neutral-800 mb-6"></div>

    {/* ✏️ PROFILE SECTION */}
    <div className="space-y-5">
      <div>
        <label className="text-sm text-neutral-400">Full Name</label>
        {edit ? (
          <input
            className="mt-2 w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-white">
            {profile.name}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral-400">Email</label>
        <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-neutral-300">
          {profile.email}
        </div>
      </div>

      <div>
        <label className="text-sm text-neutral-400">Role</label>
        <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-blue-400 capitalize">
          {profile.role}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4">
        {edit ? (
          <div className="flex gap-3">
            <button
              onClick={updateProfile}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEdit(false);
                setName(profile.name);
              }}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>

    {/* 🔐 PASSWORD SUBSECTION */}
    <div className="border-t border-neutral-800 mt-8 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Security</h3>
        <button
          onClick={() => setShowPasswordSection((prev) => !prev)}
          className="text-sm text-yellow-400 hover:underline transition"
        >
          {showPasswordSection ? "Close" : "Reset Password"}
        </button>
      </div>

      {showPasswordSection && (
        <div className="space-y-4 animate-slideDown">
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={updatePassword}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Update Password
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  );
}