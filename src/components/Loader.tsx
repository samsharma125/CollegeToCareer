"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold">
          CollegeToCareer
        </p>
      </div>
    </div>
  );
}