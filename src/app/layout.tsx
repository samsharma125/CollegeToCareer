"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import Loader from "@/components/Loader";
// ✅ ADD THIS

import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const hideLayout =
    pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">

        {loading && <Loader />}

        {!loading &&
          (hideLayout ? (
            children
          ) : (
            <AuthGuard>
              <SidebarProvider>

                <Navbar />
                <Sidebar />

           

                <main className="max-w-7xl mx-auto px-6 py-10">
                  {children}
                </main>

              </SidebarProvider>
            </AuthGuard>
          ))}

      </body>
    </html>
  );
}