import React from "react";
import { useSelector } from "react-redux";
import {
  FaEye,
  FaThumbsUp,
  FaComment,
} from "react-icons/fa";

function Content() {
  const { userData } = useSelector((state) => state.user);

  const videos = userData?.videos || [];
  const shorts = userData?.shorts || [];

  return (
    <div className="flex-1 bg-[#0f0f0f] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Channel Content
      </h1>

      {/* Videos */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Videos
        </h2>

        <div className="space-y-3">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video._id}
                className="bg-[#181818] border border-gray-800 rounded-lg p-3 flex gap-4"
              >
                <img
                  src={
                    video.thumbnailUrl ||
                    video.thumbnail
                  }
                  alt=""
                  className="w-40 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {video.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Published{" "}
                    {new Date(
                      video.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <div className="flex gap-5 mt-3 text-sm text-gray-400">
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
              No Videos Uploaded
            </p>
          )}
        </div>
      </div>

      {/* Shorts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Shorts
        </h2>

        <div className="space-y-3">
          {shorts.length > 0 ? (
            shorts.map((short) => (
              <div
                key={short._id}
                className="bg-[#181818] border border-gray-800 rounded-lg p-3 flex gap-4"
              >
                <video
                  src={short.shortUrl}
                  className="w-24 h-40 object-cover rounded"
                  muted
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {short.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Published{" "}
                    {new Date(
                      short.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <div className="flex gap-5 mt-3 text-sm text-gray-400">
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
              No Shorts Uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Content;