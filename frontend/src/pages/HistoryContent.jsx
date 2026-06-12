import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";

import ShortCard from "../component/ShortCard";
import VideoCard from "../component/VideoCard";

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

function HistoryContent() {
  const { videoHistory, shortHistory } = useSelector(
    (state) => state.user
  );

  const [durations, setDurations] = useState({});

  useEffect(() => {
    if (Array.isArray(videoHistory) && videoHistory.length > 0) {
      videoHistory.forEach((video) => {
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
  }, [videoHistory]);

  if (
    (!videoHistory && !shortHistory) ||
    ((videoHistory?.length || 0) === 0 &&
      (shortHistory?.length || 0) === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        No History Found
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">
      
      {/* Shorts History */}
      {shortHistory?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2">
            <SiYoutubeshorts />
            Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {shortHistory.map((short) => (
              <div key={short?._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  views={short?.views}
                  id={short?._id}
                  avatar={short?.channel?.avatar}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video History */}
      {videoHistory?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2">
            <GoVideo />
            Videos
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {videoHistory.map((video) => (
              <div key={video?._id} className="flex-shrink-0">
                <VideoCard
                  thumbnail={video?.thumbnail}
                  duration={durations[video?._id] || "0:00"}
                  channelLogo={video?.channel?.avatar}
                  title={video?.title}
                  channelName={video?.channel?.name}
                  views={video?.views}
                  id={video?._id}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryContent;