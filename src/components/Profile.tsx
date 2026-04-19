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
  <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-4 py-10">

    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT - PROFILE CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

          <div className="flex flex-col items-center text-center">

            {/* AVATAR */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold mb-4">
              {profile.name?.charAt(0)}
            </div>

            <h2 className="text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-400">{profile.email}</p>

            <span className="mt-2 text-xs px-3 py-1 bg-white/10 rounded-full capitalize">
              {profile.role}
            </span>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* PROFILE INFO */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

            <h3 className="font-semibold mb-4">Profile Info</h3>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-400">Name</label>

                {edit ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-xl"
                  />
                ) : (
                  <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                    {profile.name}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                  {profile.email}
                </div>
              </div>

              {/* BUTTONS */}
              <div>
                {edit ? (
                  <div className="flex gap-3">
                    <button
                      onClick={updateProfile}
                      className="flex-1 py-2 bg-green-500 rounded-xl"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEdit(false);
                        setName(profile.name);
                      }}
                      className="flex-1 py-2 bg-white/10 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEdit(true)}
                    className="w-full py-2 bg-indigo-600 rounded-xl"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Security</h3>

              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-sm text-purple-400"
              >
                {showPasswordSection ? "Close" : "Reset Password"}
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-3">

                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl"
                />

                <button
                  onClick={updatePassword}
                  className="w-full py-2 bg-green-500 rounded-xl"
                >
                  Update Password
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  </div>
);
}