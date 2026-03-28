"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ✅ LUCIDE ICONS
import { Bell, UserPlus, FileText, FolderOpen } from "lucide-react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState("");

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // INIT
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

    await fetchNotifications(uid, userRole);
  };

  // FETCH
  const fetchNotifications = async (uid: string, role: string) => {
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (role === "student") {
      query = query
        .in("type", ["assignment", "material"])
        .or(`student_id.eq.${uid},student_id.is.null`);
    }

    if (role === "teacher") {
      query = query.eq("type", "student_signup");
    }

    const { data } = await query;

    const notif = data || [];

    setNotifications(notif);
    setCount(notif.filter((n) => !n.is_read).length);
  };

  // MARK READ
  const markAllAsRead = async () => {
    if (!notifications.length) return;

    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    setCount(0);
  };

  // REALTIME
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notif-dropdown")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications(userId, role);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);

  // CLOSE OUTSIDE
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  // CLICK NOTIF
  const handleClickNotif = async (n: any) => {
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

    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* 🔔 BELL */}
      <button
        onClick={async () => {
          const newState = !open;
          setOpen(newState);

          if (newState) {
            await markAllAsRead();
          }
        }}
        className="relative p-2 sm:p-3 rounded-full hover:bg-neutral-800 transition active:scale-95"
      >
        <Bell size={22} />

        {/* 🔴 BADGE */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
            {count}
          </span>
        )}
      </button>

      {/* ✅ FIXED DROPDOWN */}
      {open && (
        <div
       className="absolute right-0 top-full mt-2 translate-x-16
w-72 sm:w-80 max-w-[90vw]
bg-neutral-900 border border-neutral-700 
rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-neutral-800 font-semibold flex items-center gap-2">
            <Bell size={16} /> Notifications
          </div>

          {/* LIST */}
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-gray-400 text-sm text-center">
                No notifications
              </p>
            )}

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
                  onClick={() => handleClickNotif(n)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-800 transition
                  ${
                    !n.is_read
                      ? "bg-blue-900/20 border-l-2 border-blue-500"
                      : ""
                  }`}
                >
                  <Icon size={16} />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        
        </div>
      )}
    </div>
  );
}