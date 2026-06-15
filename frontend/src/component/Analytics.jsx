import React from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function Analytics() {
  const { userData } = useSelector((state) => state.user);

  const videos = userData?.videos || [];
  const shorts = userData?.shorts || [];

  const videoData = videos.map((video) => ({
    title: video.title,
    views: video.views || 0,
  }));

  const shortData = shorts.map((short) => ({
    title: short.title,
    views: short.views || 0,
  }));

  return (
    <div className="w-full min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold text-center mb-8">
        Channel Analytics (Video & Shorts Views)
      </h1>

      {/* Video Chart */}

      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4 mb-8">
        <h2 className="text-center text-lg font-semibold mb-4">
          Videos Views
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Shorts Chart */}

      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-center text-lg font-semibold mb-4">
          Shorts Views
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="views"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;