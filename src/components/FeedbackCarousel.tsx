"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackCarousel() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const isHovered = useRef(false);

  // 🔥 FETCH DATA
  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    setFeedbacks(data || []);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 🔁 AUTO PLAY
  useEffect(() => {
    if (feedbacks.length === 0) return;

    let timeout: any;

    const loop = () => {
      timeout = setTimeout(() => {
        if (!isHovered.current) {
          setIndex((prev) => (prev + 1) % feedbacks.length);
        }
        loop();
      }, 3000);
    };

    loop();

    return () => clearTimeout(timeout);
  }, [feedbacks.length]);

  const next = () => {
    setIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? feedbacks.length - 1 : prev - 1
    );
  };

  if (feedbacks.length === 0) {
    return <p className="text-center text-gray-400">No feedback yet 🚀</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 overflow-hidden">

      {/* 🎯 CAROUSEL */}
      <div
        className="relative w-full max-w-4xl h-[300px] flex items-center justify-center"
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
      >
        <AnimatePresence>
          {feedbacks.map((item, i) => {
            const position =
              (i - index + feedbacks.length) % feedbacks.length;

            let x = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 1;
            let blur = 0;
            let brightness = 1;
            let rotateY = 0;

            if (position === 0) {
              // 🎯 CENTER
              x = 0;
              scale = 1.2;
              zIndex = 3;
              opacity = 1;
              blur = 0;
              brightness = 1;
              rotateY = 0;
            } else if (position === 1) {
              // 👉 RIGHT
              x = 220;
              scale = 0.9;
              zIndex = 2;
              opacity = 0.7;
              blur = 2;
              brightness = 0.8;
              rotateY = -25;
            } else if (position === feedbacks.length - 1) {
              // 👈 LEFT
              x = -220;
              scale = 0.9;
              zIndex = 2;
              opacity = 0.7;
              blur = 2;
              brightness = 0.8;
              rotateY = 25;
            } else {
              // 🌫️ BACK
              x = 0;
              scale = 0.7;
              zIndex = 0;
              opacity = 0.25;
              blur = 8;
              brightness = 0.5;
              rotateY = 0;
            }

            return (
              <motion.div
                key={item.id}
                className="absolute w-[260px]"
                animate={{
                  x,
                  scale,
                  opacity,
                  rotateY,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                }}
                style={{ zIndex }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -50) next();
                  if (info.offset.x > 50) prev();
                }}
              >
                {/* 💎 CARD */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

                  {/* 🔥 ACTIVE GLOW */}
                  {position === 0 && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl"></div>
                  )}

                  {/* AVATAR */}
                  <div className="relative z-10 w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                    {item.name?.charAt(0)}
                  </div>

                  {/* MESSAGE */}
                  <p className="relative z-10 text-gray-300 text-sm mb-3">
                    "{item.message}"
                  </p>

                  {/* NAME */}
                  <h3 className="relative z-10 text-white font-semibold">
                    {item.name}
                  </h3>

                  {/* RATING */}
                  <p className="relative z-10 text-yellow-400 mt-2">
                    {"⭐".repeat(item.rating || 5)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🎮 CONTROLS */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={prev}
          className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
        >
          ◀
        </button>

        <button
          onClick={next}
          className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
}