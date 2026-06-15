import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import ShortCard from "./ShortCard";

function FilterResult({ SearchResults }) {
  const [durations, setDurations] = useState({});

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

    video.onerror = () => callback("0:00");

    video.src = url;
  };

  useEffect(() => {
    if (
      Array.isArray(SearchResults?.videos) &&
      SearchResults.videos.length > 0
    ) {
      SearchResults.videos.forEach((video) => {
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
  }, [SearchResults]);

  const isEmpty =
    (!SearchResults?.videos || SearchResults.videos.length === 0) &&
    (!SearchResults?.shorts || SearchResults.shorts.length === 0) &&
    (!SearchResults?.channels || SearchResults.channels.length === 0) &&
    (!SearchResults?.playlists || SearchResults.playlists.length === 0);

  return (
    <div className="px-6 py-4 bg-[#00000051] border border-gray-800 mb-5">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>

      {isEmpty ? (
        <p className="text-gray-400 text-lg">No Results Found</p>
      ) : (
        <>
          {/* Videos */}
          {SearchResults?.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>

              <div className="flex flex-wrap gap-6 mb-10">
                {SearchResults.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    duration={durations[video._id] || "0:00"}
                    channelLogo={video.channel?.avatar}
                    title={video.title}
                    channelName={video.channel?.name}
                    views={video.views}
                    time={new Date(
                      video.createdAt
                    ).toLocaleDateString()}
                    id={video._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shorts */}
          {SearchResults?.shorts?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {SearchResults.shorts.map((short) => (
                  <div key={short._id} className="flex-shrink-0">
                    <ShortCard
                      shortUrl={short.shortUrl}
                      title={short.title}
                      channelName={short.channel?.name}
                      views={short.views}
                      id={short._id}
                      avatar={short.channel?.avatar}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channels */}
          {SearchResults?.channels?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Channels</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SearchResults.channels.map((channel) => (
                  <div
                    key={channel._id}
                    className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg"
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-12 h-12 rounded-full"
                    />

                    <div>
                      <h4 className="font-semibold">
                        {channel.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {channel.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists */}
          {SearchResults?.playlists?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Playlists</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SearchResults.playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="p-4 border border-gray-700 rounded-lg"
                  >
                    <h4 className="font-semibold">
                      {playlist.title}
                    </h4>

                    <p className="text-sm text-gray-400 mt-1">
                      {playlist.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FilterResult;