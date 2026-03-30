"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#020617] z-[9999]">
      
      {/* Glow Background */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[120px] opacity-30 animate-pulse rounded-full"></div>

      <div className="relative flex flex-col items-center gap-6">

        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-white/10"></div>

          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-400 border-r-purple-500 animate-spin"></div>

          {/* Inner Glow Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
            CollegeToCareer
          </h1>
          <p className="text-sm text-gray-400 mt-1 animate-pulse">
            Loading .....
          </p>
        </div>

      </div>
    </div>
  );
}