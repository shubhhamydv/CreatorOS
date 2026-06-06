import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

// Helper: Get video duration from URL
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";

  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src);

    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  video.onerror = () => {
    callback("0:00");
  };

  video.src = url;
};

function AllVideosPage() {
  const allVideosData = useSelector(
    (state) => state.content?.allVideosData || []
  );

  const [durations, setDurations] = useState({});

  useEffect(() => {
    if (Array.isArray(allVideosData) && allVideosData.length > 0) {
      allVideosData.forEach((video) => {
        if (video?.videoUrl && video?._id) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }));
          });
        }
      });
    }
  }, [allVideosData]);

  console.log("🔥 VIDEOS STATE:", allVideosData);

  if (!allVideosData.length) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "#555",
          fontSize: "14px",
        }}
      >
        No videos found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4"> {/**md:justify-center */}
      {allVideosData.map((video) => (
        <VideoCard
          key={video?._id}
          id={video?._id}
          thumbnail={video?.thumbnail}
          title={video?.title}
          channelLogo={
            video?.channel?.avatar || video?.channel?.photoUrl
          }
          channelName={video?.channel?.name}
          duration={durations[video?._id] || "0:00"}
          views={video?.views}
          id={vide?._id}
          views={video?.views}
        />
      ))}
    </div>
  );
}

export default AllVideosPage;