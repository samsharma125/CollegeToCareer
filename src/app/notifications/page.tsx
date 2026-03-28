"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// 🔥 ICONS
import { Bell, UserPlus, FileText, FolderOpen } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      await init();
    };
    run();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id;

    if (!uid) return;

    setUserId(uid);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .single();

    const userRole = profile?.role || "";
    setRole(userRole);

    fetchNotifications(uid, userRole);
  };

  const fetchNotifications = async (uid: string, role: string) => {
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (role === "student") {
      query = query.or(`student_id.eq.${uid},student_id.is.null`);
    }

    if (role === "teacher") {
      query = query.in("type", [
        "student_signup",
        "assignment",
        "material",
      ]);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    setNotifications(data || []);
  };

  const handleClick = async (n: any) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", n.id);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === n.id ? { ...item, is_read: true } : item
      )
    );

    if (n.type === "student_signup") {
      router.push(`/teacher/students/${n.reference_id}`);
    }

    if (n.type === "assignment") {
      router.push(`/assignments/${n.reference_id}`);
    }

    if (n.type === "material") {
      router.push(`/study`);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto text-white">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Bell size={22} />
        <h1 className="text-xl sm:text-2xl font-bold">
          Notifications
        </h1>
      </div>

      {notifications.length === 0 && (
        <p className="text-center text-gray-400">
          No notifications yet
        </p>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon =
            n.type === "student_signup"
              ? UserPlus
              : n.type === "assignment"
              ? FileText
              : FolderOpen;

          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex gap-3 items-start p-4 rounded-xl cursor-pointer transition border ${
                n.is_read
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-blue-900/30 border-blue-500"
              } hover:bg-neutral-800`}
            >
              {/* ICON */}
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Icon size={18} />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">
                  {n.title}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>

              {/* STATUS DOT */}
              {!n.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}