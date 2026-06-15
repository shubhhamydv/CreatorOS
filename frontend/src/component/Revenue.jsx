import React from "react";
import { useSelector } from "react-redux";
import { FaDollarSign } from "react-icons/fa";

function Revenue() {
  const { userData } = useSelector((state) => state.user);

  const videos = userData?.videos || [];
  const shorts = userData?.shorts || [];

  const totalViews =
    videos.reduce((sum, video) => sum + (video.views || 0), 0) +
    shorts.reduce((sum, short) => sum + (short.views || 0), 0);

  // Example Revenue Calculation
  const estimatedRevenue = ((totalViews / 1000) * 2).toFixed(2);

  return (
    <div className="flex-1 min-h-screen bg-[#0f0f0f] text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        Revenue Analytics
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Views */}
        <div className="bg-[#181818] border border-gray-700 rounded-lg p-5">
          <h2 className="text-gray-400 text-sm">
            Total Views
          </h2>

          <p className="text-3xl font-bold mt-2">
            {totalViews}
          </p>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-[#181818] border border-gray-700 rounded-lg p-5">
          <h2 className="text-gray-400 text-sm">
            Estimated Revenue
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <FaDollarSign className="text-green-500 text-2xl" />
            <p className="text-3xl font-bold">
              {estimatedRevenue}
            </p>
          </div>
        </div>

        {/* Content Count */}
        <div className="bg-[#181818] border border-gray-700 rounded-lg p-5">
          <h2 className="text-gray-400 text-sm">
            Total Content
          </h2>

          <p className="text-3xl font-bold mt-2">
            {videos.length + shorts.length}
          </p>
        </div>
      </div>

      {/* Revenue Info */}
      <div className="bg-[#181818] border border-gray-700 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Revenue Details
        </h2>

        <div className="space-y-3 text-gray-300">
          <p>
            Total Videos:{" "}
            <span className="font-semibold">
              {videos.length}
            </span>
          </p>

          <p>
            Total Shorts:{" "}
            <span className="font-semibold">
              {shorts.length}
            </span>
          </p>

          <p>
            Total Views:{" "}
            <span className="font-semibold">
              {totalViews}
            </span>
          </p>

          <p>
            Estimated Earnings (RPM $2):
            <span className="font-semibold text-green-400 ml-2">
              ${estimatedRevenue}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Revenue;