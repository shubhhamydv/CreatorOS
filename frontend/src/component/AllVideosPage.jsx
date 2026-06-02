import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

// ── Helper: video URL se duration nikalo ──────────────────────────────────────
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video"); // ✅ "video" not "videos"
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };
  video.onerror = () => callback("0:00");
};

// ── Single card wrapper that loads its own duration ──────────────────────────
function VideoCardWrapper({ video }) {
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (video?.videoUrl) {
      getVideoDuration(video.videoUrl, setDuration);
    }
  }, [video?.videoUrl]);

  return (
    <VideoCard
      key={video?._id}
      id={video?._id}
      thumbnail={video?.thumbnail}
      title={video?.title}
      channelLogo={video?.channel?.avatar || video?.channel?.photoUrl}
      channelName={video?.channel?.name}
      duration={duration}
      views={video?.views}
    />
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function AllVideosPage() {
  const allVideosData = useSelector(
    (state) => state.content?.allVideosData || []
  );

  console.log("🔥 VIDEOS STATE:", allVideosData);

  if (allVideosData.length === 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "60vh", color: "#555", fontSize: "14px"
      }}>
        No videos found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
      {allVideosData.map((video) => (
        <VideoCardWrapper key={video?._id} video={video} />
      ))}
    </div>
  );
}

export default AllVideosPage;