import { supabase } from "@/lib/supabase";

// 🔹 GET VIDEOS
export async function getPlaylistVideos(playlistId: string) {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;

  let allVideos: any[] = [];
  let nextPageToken = "";

  try {
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("API RESPONSE:", data); // DEBUG

      if (!data.items) break;

      const videos = data.items
        .filter((item: any) => item.snippet.title !== "Private video")
        .map((item: any) => ({
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
          thumbnail: item.snippet.thumbnails?.medium?.url,
        }));

      allVideos = [...allVideos, ...videos];

      nextPageToken = data.nextPageToken || "";

    } while (nextPageToken);

    console.log("TOTAL VIDEOS:", allVideos.length);

    return allVideos;

  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return [];
  }
}


