import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SiYoutubeshorts } from 'react-icons/si'
import { GoVideo } from 'react-icons/go'
import VideoCard from '../component/VideoCard'
import ShortCard from '../component/ShortCard'

function Subscription() {
  const navigate = useNavigate()
  const subscribedChannels = useSelector((state) => state.user.subscribedChannels) || []
  const subscribedVideos  = useSelector((state) => state.user.subscribedVideos)  || []
  const subscribedShorts  = useSelector((state) => state.user.subscribedshorts)  || []

  if (subscribedChannels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-400 gap-4">
        <div className="text-6xl">📺</div>
        <p className="text-xl">You haven't subscribed to any channels yet.</p>
        <button
          className="mt-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition"
          onClick={() => navigate('/')}
        >
          Explore videos
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 min-h-screen bg-[#0f0f0f] text-white mt-[50px] lg:mt-[20px]">

      {/* Subscribed Channel Avatars */}
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {subscribedChannels.map((ch) => (
          <button
            key={ch._id}
            onClick={() => navigate(`/channelpage/${ch._id}`)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <img
              src={ch?.avatar}
              alt={ch?.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-orange-500 transition"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition truncate w-16 text-center">
              {ch?.name}
            </span>
          </button>
        ))}
      </div>

      {/* Subscribed Shorts */}
      {subscribedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-4 border-b border-gray-700 flex items-center gap-2">
            <SiYoutubeshorts className="text-orange-500" /> Subscribed Shorts
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
      {subscribedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-8 border-b border-gray-700 flex items-center gap-2">
            <GoVideo /> Subscribed Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscribedVideos.map((video) => (
              <VideoCard
                key={video?._id}
                thumbnail={video?.thumbnail}
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

    </div>
  )
}

export default Subscription