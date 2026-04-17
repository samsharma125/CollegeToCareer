"use client";

export default function LecturePlayer({ videoId }: { videoId: string }) {
  return (
    <iframe
      className="w-full h-[70vh] rounded-xl"
      src={`https://www.youtube.com/embed/${videoId}`}
      allowFullScreen
    />
  );
}