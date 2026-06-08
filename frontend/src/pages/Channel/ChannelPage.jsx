import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";

function ChannelPage() {
  const { channelId } = useParams();

  const { allChannelData, userData } = useSelector(
    (state) => state.user
  );

  const channelData = allChannelData?.find(
    (c) => c._id === channelId
  );

  const [channel, setChannel] = useState(channelData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  const [isSubscribed, setIsSubscribed] = useState(
    channelData?.subscribers?.some(
      (sub) =>
        sub?._id?.toString() === userData?._id?.toString() ||
        sub?.toString() === userData?._id?.toString()
    )
  );

  useEffect(() => {
    setChannel(channelData);
  }, [channelData]);

  useEffect(() => {
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) =>
          sub?._id?.toString() === userData?._id?.toString() ||
          sub?.toString() === userData?._id?.toString()
      )
    );
  }, [channel?.subscribers, userData?._id]);

  const handleSubscribe = async () => {
    if (!channel?._id) return;

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        {
          channelId: channel._id,
        },
        {
          withCredentials: true,
        }
      );

      setChannel((prev) => ({
        ...prev,
        subscribers: result.data.subscribers || prev.subscribers,
      }));
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="text-white min-h-screen pt-[10px]">
      {/* Banner */}
      <div className="relative">
        <img
          src={channel?.banner}
          alt=""
          className="w-full h-60 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Channel Info */}
      <div className="relative flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap">
        <div>
          <img
            src={channel?.avatar}
            alt=""
            className="rounded-full w-28 h-28 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover:ring-red-600 transition-transform duration-300"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-wide">
            {channel?.name}
          </h1>

          <p className="text-gray-400 mt-1">
            <span className="font-semibold text-white">
              {channel?.subscribers?.length || 0}
            </span>{" "}
            Subscribers •{" "}
            <span className="font-semibold text-white">
              {channel?.videos?.length || 0}
            </span>{" "}
            Videos
          </p>

          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {channel?.category}
          </p>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`px-[20px] py-[8px] rounded-xl border border-gray-600 ml-[20px] font-medium transition-all ${
            isSubscribed
              ? "bg-gray-500 text-white"
              : "bg-white text-black hover:bg-orange-500 hover:text-black"
          }`}
        >
          {loading ? (
            <ClipLoader size={20} color="black" />
          ) : isSubscribed ? (
            "Subscribed"
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 px-6 border-b border-gray-800 mb-6 relative mt-6">
        {["videos", "shorts", "playlists", "communityPosts"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 relative font-medium transition ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full"></span>
              )}
            </button>
          )
        )}
      </div>

      {/* Content */}
      <div className="px-6">
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channel?.videos?.map((video) => (
              <div
                key={video._id}
                className="bg-[#181818] rounded-lg overflow-hidden"
              >
                <img
                  src={video?.thumbnail}
                  alt={video?.title}
                  className="w-full h-40 object-cover"
                />
                <p className="p-3 text-sm font-medium truncate">
                  {video?.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shorts" && (
          <div className="text-center text-gray-400 py-10">
            No Shorts Available
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="text-center text-gray-400 py-10">
            No Playlists Available
          </div>
        )}

        {activeTab === "communityPosts" && (
          <div className="text-center text-gray-400 py-10">
            No Community Posts Available
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;