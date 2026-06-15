import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "./VideoCard";
import ShortCard from "./ShortCard";

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");

  video.preload = "metadata";

  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    callback(
      `${minutes}:${seconds.toString().padStart(2, "0")}`
    );
  };

  video.onerror = () => {
    callback("0:00");
  };

  video.src = url;
};

function RecommendedContent() {
  const { recommendedContent } = useSelector(
    (state) => state.user
  );

  const recommendedVideos =
    recommendedContent?.recommendedVideos || [];

  const recommendedShorts =
    recommendedContent?.recommendedShorts || [];

  const [durations, setDurations] = useState({});

  useEffect(() => {
    recommendedVideos.forEach((video) => {
      if (video.videoUrl && !durations[video._id]) {
        getVideoDuration(video.videoUrl, (duration) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: duration,
          }));
        });
      }
    });
  }, [recommendedVideos]);

  return (
    <div className="px-4 py-4">
      {/* Recommended Videos */}
      {recommendedVideos.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">
            Recommended Videos
          </h2>

          <div className="flex flex-wrap gap-5">
            {recommendedVideos.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnailUrl}
                title={video.title}
                channelName={video.userName}
                channelLogo={video.userProfilePic}
                views={video.views || 0}
                duration={durations[video._id] || "0:00"}
                time={new Date(
                  video.createdAt
                ).toLocaleDateString()}
              />
            ))}
          </div>
        </>
      )}

      {/* Shorts */}
      {recommendedShorts.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-10 mb-4">
            <SiYoutubeshorts className="text-red-500 text-2xl" />
            <h2 className="text-xl font-bold">Shorts</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {recommendedShorts.map((short) => (
              <ShortCard
                key={short._id}
                id={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.userName}
                avatar={short.userProfilePic}
                views={short.views || 0}
              />
            ))}
          </div>
        </>
      )}

      {recommendedVideos.length === 0 &&
        recommendedShorts.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No recommendations available
          </div>
        )}
    </div>
  );
}

export default RecommendedContent;