"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPlaylistVideos } from "@/lib/youtube";
import YouTube from "react-youtube";

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params?.subjectId as string;

  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [completedLectures, setCompletedLectures] = useState<number[]>([]);

  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  let playerRef: any = null;

  // 🔥 FETCH DATA
  useEffect(() => {
    if (!subjectId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data } = await supabase
          .from("courses")
          .select("playlist_url")
          .eq("id", subjectId)
          .single();

        const match = data?.playlist_url?.match(/list=([^&]+)/);
        const playlistId = match ? match[1] : null;

        if (!playlistId) return;

        const vids = await getPlaylistVideos(playlistId);
        setVideos(vids || []);

        // ✅ COMPLETED
        const { data: completed } = await supabase
          .from("progress")
          .select("lecture_index")
          .eq("course_id", subjectId)
          .eq("user_id", "demo-user");

        setCompletedLectures(
          completed?.map((c: any) => c.lecture_index) || []
        );

        // ▶️ LAST WATCHED
        const { data: last } = await supabase
          .from("progress")
          .select("*")
          .eq("course_id", subjectId)
          .eq("user_id", "demo-user")
          .order("lecture_index", { ascending: false })
          .limit(1)
          .single();

        setCurrentIndex(last?.lecture_index || 0);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  // 🔥 LOAD NOTES + BOOKMARKS
  useEffect(() => {
    if (!subjectId) return;

    const loadExtras = async () => {
      const { data: notesData } = await supabase
        .from("notes")
        .select("*")
        .eq("course_id", subjectId)
        .eq("lecture_index", currentIndex)
        .eq("user_id", "demo-user");

      setNotes(notesData || []);

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("course_id", subjectId)
        .eq("lecture_index", currentIndex)
        .eq("user_id", "demo-user");

      setBookmarks(bookmarkData || []);
    };

    loadExtras();
  }, [currentIndex, subjectId]);

  // 🔥 AUTO COMPLETE + NEXT
  const handleEnd = async () => {
    await supabase.from("progress").upsert({
      user_id: "demo-user",
      course_id: subjectId,
      lecture_index: currentIndex,
      completed: true,
    });

    setCompletedLectures((prev) => [
      ...new Set([...prev, currentIndex]),
    ]);

    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 📝 ADD NOTE
  const addNote = async () => {
    if (!newNote.trim()) return;

    const { data } = await supabase
      .from("notes")
      .insert({
        user_id: "demo-user",
        course_id: subjectId,
        lecture_index: currentIndex,
        content: newNote,
      })
      .select();

    setNotes((prev) => [...prev, ...(data || [])]);
    setNewNote("");
  };

  // 🔖 ADD BOOKMARK
  const addBookmark = async () => {
    const time = playerRef?.getCurrentTime?.() || 0;
    const label = prompt("Bookmark name:");

    if (!label) return;

    const { data } = await supabase
      .from("bookmarks")
      .insert({
        user_id: "demo-user",
        course_id: subjectId,
        lecture_index: currentIndex,
        timestamp: Math.floor(time),
        label,
      })
      .select();

    setBookmarks((prev) => [...prev, ...(data || [])]);
  };

  const current = videos[currentIndex];

  const progressPercent = videos.length
    ? Math.round((completedLectures.length / videos.length) * 100)
    : 0;

  return (
    <div className="flex h-screen text-white bg-black">

      {/* 🎥 LEFT SIDE */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {loading ? (
          <div className="p-4">Loading...</div>
        ) : current ? (
          <>
            {/* TITLE */}
            <div className="sticky top-0 bg-black/80 p-3 border-b">
              <h2 className="font-semibold">
                Lecture {currentIndex + 1}: {current.title}
              </h2>
            </div>

            {/* PROGRESS */}
            <div className="px-4 py-2">
              <div className="w-full bg-white/10 h-2 rounded">
                <div
                  className="bg-indigo-500 h-2 rounded"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm mt-1 text-gray-400">
                {progressPercent}% completed
              </p>
            </div>

            {/* 🎥 VIDEO */}
            <div className="p-4">
              <div className="w-full aspect-video">
                <YouTube
                  videoId={current.videoId}
                  className="w-full h-full"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      rel: 0,
                    },
                  }}
                  onReady={(e) => (playerRef = e.target)}
                  onEnd={handleEnd}
                />
              </div>
            </div>

            {/* 🔥 BELOW VIDEO */}
            <div className="px-4 pb-10 space-y-6">

              {/* ✅ COMPLETE + NEXT */}
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    if (completedLectures.includes(currentIndex)) return;

                    await supabase.from("progress").upsert({
                      user_id: "demo-user",
                      course_id: subjectId,
                      lecture_index: currentIndex,
                      completed: true,
                    });

                    setCompletedLectures((prev) => [
                      ...new Set([...prev, currentIndex]),
                    ]);
                  }}
                  className={`px-4 py-2 rounded font-medium ${
                    completedLectures.includes(currentIndex)
                      ? "bg-green-600"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {completedLectures.includes(currentIndex)
                    ? "✓ Completed"
                    : "Mark as Complete"}
                </button>

                <button
                  onClick={() => {
                    if (currentIndex < videos.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                    }
                  }}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
                >
                  Next →
                </button>
              </div>

              {/* BOOKMARKS */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">Bookmarks</h3>
                  <button
                    onClick={addBookmark}
                    className="bg-indigo-500 px-3 py-1 rounded text-sm"
                  >
                    + Add
                  </button>
                </div>

                {bookmarks.length === 0 ? (
                  <p className="text-gray-400 text-sm">No bookmarks</p>
                ) : (
                  bookmarks.map((b, i) => (
                    <div
                      key={i}
                      onClick={() => playerRef.seekTo(b.timestamp)}
                      className="cursor-pointer text-sm mb-1 hover:text-indigo-400"
                    >
                      ⏱ {b.label}
                    </div>
                  ))
                )}
              </div>

              {/* NOTES */}
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>

                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 bg-black/40 rounded"
                  placeholder="Write notes..."
                />

                <button
                  onClick={addNote}
                  className="bg-indigo-500 px-3 py-1 mt-2 rounded"
                >
                  Save Note
                </button>

                {notes.map((n, i) => (
                  <div key={i} className="mt-2 bg-white/5 p-2 rounded text-sm">
                    {n.content}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-4">No videos</div>
        )}
      </div>

      {/* 📚 SIDEBAR */}
      <div className="w-80 bg-black/40 p-4 overflow-y-auto border-l border-white/10">
        <h3 className="mb-3 font-semibold">Lectures</h3>

        {videos.map((vid, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`mb-2 p-2 cursor-pointer rounded ${
              currentIndex === index ? "bg-indigo-500" : "hover:bg-white/10"
            }`}
          >
            {index + 1}. {vid.title}
            {completedLectures.includes(index) && " ✔"}
          </div>
        ))}
      </div>
    </div>
  );
}