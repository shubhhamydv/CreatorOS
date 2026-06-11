import React, { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import { FaList } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ShortCard from "../component/ShortCard";
import VideoCard from "../component/VideoCard";
import PlaylistCard from "../component/PlaylistCard";
import PostCard from "../component/PostCard";
import {RiUserCommunityFill} from "react-icons/ri";
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";

  video.onloadedmetadata = () => {
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

function Subscription() {
  const {
    subscribedChannel = [],
    subscribedVideo = [],
    subscribedShorts = [],
    subscribedPlaylist = [],
  } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [durations, setDurations] = useState({});

  useEffect(() => {
    if (Array.isArray(subscribedVideo) && subscribedVideo.length > 0) {
      subscribedVideo.forEach((video) => {
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
  }, [subscribedVideo]);

  if (
    subscribedChannel.length === 0 &&
    subscribedShorts.length === 0 &&
    subscribedVideo.length === 0 &&
    subscribedPlaylist.length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        No Subscription Content Found
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px]">

      {/* Subscribed Channels */}
      {subscribedChannel.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">
            Subscribed Channels
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {subscribedChannel.map((ch) => (
              <div
                key={ch?._id}
                onClick={() => navigate(`/channelpage/${ch._id}`)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={ch?.avatar}
                  alt={ch?.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-600 shadow-md"
                />

                <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
                  {ch?.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Subscribed Shorts */}
      {subscribedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
            Subscribed Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {subscribedShorts.map((short) => (
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

      {/* Subscribed Videos */}
      {subscribedVideo.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 mt-8 border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo />
            Subscribed Videos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscribedVideo.map((video) => (
              <VideoCard
                key={video?._id}
                thumbnail={video?.thumbnail}
                duration={durations[video?._id] || "0:00"}
                channelLogo={video?.channel?.avatar}
                title={video?.title}
                channelName={video?.channel?.name}
                views={video?.views}
                id={video?._id}
              />
            ))}
          </div>
        </>
      )}

      {/* Subscribed Playlists */}
      {subscribedPlaylist.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 mt-8 border-b border-gray-300 pb-2 flex items-center gap-2">
            <FaList className="w-7 h-7 text-orange-600" />
            Subscribed Playlists
          </h2>

          <div className="flex flex-wrap gap-6">
            {subscribedPlaylist.map((playlist) => (
              <PlaylistCard
                key={playlist?._id}
                id={playlist?._id}
                title={playlist?.title}
                videos={playlist?.videos}
                savedBy={playlist?.savedBy}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
{subscribedPosts.length > 0 && (
  <>
    <h2 className="text-2xl font-bold mb-6 mt-8 border-b border-gray-300 pb-2 flex items-center gap-2">
      <RiUserCommunityFill className="w-6 h-6 text-orange-600" />
      Subscribed Posts
    </h2>

    <div className="flex flex-col gap-6">
      {subscribedPosts.map((post) => (
        <PostCard
          key={post?._id}
          post={post}
        />
      ))}
    </div>
  </>
)}

export default Subscription;