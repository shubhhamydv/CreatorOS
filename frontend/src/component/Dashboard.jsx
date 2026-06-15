import React from "react";
import { useSelector } from "react-redux";
import {
  FaEye,
  FaThumbsUp,
  FaComment,
} from "react-icons/fa";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);

  const videos = userData?.videos || [];
  const shorts = userData?.shorts || [];

  const totalViews =
    videos.reduce(
      (sum, video) => sum + (video.views || 0),
      0
    ) +
    shorts.reduce(
      (sum, short) => sum + (short.views || 0),
      0
    );

  const subscribers =
    userData?.subscribers?.length || 1;

  return (
    <div className="flex-1 bg-[#0f0f0f] text-white p-6 overflow-y-auto">
      {/* Analytics */}
      <h1 className="text-xl font-semibold mb-4">
        Channel Analytics
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#181818] p-4 rounded">
          <p className="text-gray-400 text-sm">
            Views
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {totalViews}
          </h2>
        </div>

        <div className="bg-[#181818] p-4 rounded">
          <p className="text-gray-400 text-sm">
            Subscribers
          </p>

          <h2 className="text-2xl font-bold mt-1">
            +{subscribers}
          </h2>
        </div>
      </div>

      {/* Videos + Shorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Videos */}
        <div>
          <h2 className="font-semibold mb-4">
            Latest Videos
          </h2>

          <div className="space-y-3">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-[#181818] rounded p-3 flex gap-3"
                >
                  <img
                    src={
                      video.thumbnailUrl ||
                      video.thumbnail
                    }
                    alt=""
                    className="w-28 h-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {video.title}
                    </h3>

                    <p className="text-xs text-gray-400">
                      Published{" "}
                      {new Date(
                        video.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {video.views || 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaThumbsUp />
                        {video.likes?.length || 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaComment />
                        {video.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No Videos Found
              </p>
            )}
          </div>
        </div>

        {/* Shorts */}
        <div>
          <h2 className="font-semibold mb-4">
            Latest Shorts
          </h2>

          <div className="space-y-3">
            {shorts.length > 0 ? (
              shorts.map((short) => (
                <div
                  key={short._id}
                  className="bg-[#181818] rounded p-3 flex gap-3"
                >
                  <video
                    src={short.shortUrl}
                    className="w-20 h-28 rounded object-cover"
                    muted
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {short.title}
                    </h3>

                    <p className="text-xs text-gray-400">
                      Published{" "}
                      {new Date(
                        short.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {short.views || 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaThumbsUp />
                        {short.likes?.length || 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaComment />
                        {short.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No Shorts Found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;