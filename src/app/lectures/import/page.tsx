"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPlaylistVideos } from "@/lib/youtube";
import YouTube from "react-youtube";

export default function SubjectPage() {
  const { subjectId } = useParams();

  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from("courses")
        .select("playlist_url")
        .eq("id", subjectId)
        .single();

      if (!data?.playlist_url) return;

      const playlistId = data.playlist_url
        .split("list=")[1]
        ?.split("&")[0];

      const vids = await getPlaylistVideos(playlistId);

      setVideos(vids);
    };

    fetchVideos();
  }, [subjectId]);

  // 🔥 AUTO PLAY NEXT
  const handleEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const current = videos[currentIndex];

  return (
    <div className="flex h-screen text-white">

      {/* 🎥 VIDEO PLAYER */}
      <div className="flex-1 p-4">
        {current ? (
          <>
            <h2 className="mb-3">{current.title}</h2>

            <YouTube
              videoId={current.videoId}
              opts={{
                width: "100%",
                height: "500",
                playerVars: {
                  autoplay: 1,
                },
              }}
              onEnd={handleEnd} // 🔥 AUTO NEXT
            />
          </>
        ) : (
          <p>Loading video...</p>
        )}
      </div>

      {/* 📚 PLAYLIST */}
      <div className="w-80 bg-black/40 p-4 overflow-y-auto">
        <h3 className="mb-4 font-semibold">Lectures</h3>

        {videos.map((vid, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              currentIndex === index
                ? "bg-indigo-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {vid.title}
          </div>
        ))}
      </div>
    </div>
  );
}