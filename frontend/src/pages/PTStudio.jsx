import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaChartBar, FaVideo } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";

function PTStudio() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-gray-800">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <SiYoutubestudio className="text-orange-500 text-3xl" />
          <h1 className="text-lg font-bold">
            PT<span className="text-white">Studio</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 p-4">
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/80"
              alt="profile"
              className="w-20 h-20 rounded-full"
            />

            <h2 className="mt-3 font-bold">
              VIRTUAL CODING
            </h2>

            <p className="text-gray-400 text-sm">
              Your Channel
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded">
              <FaTachometerAlt />
              Dashboard
            </button>

            <button className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded">
              <FaVideo />
              Content
            </button>

            <button className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded">
              <FaChartBar />
              Analytics
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-[#181818] rounded-lg h-[500px] border border-gray-800 flex items-center justify-center">
            <h2 className="text-2xl text-gray-400">
              Welcome to PT Studio
            </h2>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PTStudio;