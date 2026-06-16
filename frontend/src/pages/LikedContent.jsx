import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { SiYoutubeshorts } from 'react-icons/si'
import ShortCard from '../component/ShortCard'
import { GoVideo } from 'react-icons/go'
import VideoCard from '../component/VideoCard'
import { FaThumbsUp, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video")
  video.preload = "metadata"
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    const totalSeconds = Math.floor(video.duration)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`)
  }
  video.onerror = () => { callback("0:00") }
  video.src = url
}

function LikedContent() {
  const [likedVideo, setLikedVideo] = useState([])
  const [likedShort, setLikedShort] = useState([])
  const [durations, setDurations] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (likedVideo.length > 0) {
      likedVideo.forEach((video) => {
        if (video?.videoUrl && video?._id) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({ ...prev, [video._id]: formattedTime }))
          })
        }
      })
    }
  }, [likedVideo])

  useEffect(() => {
    const fetchLikedContent = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/content/likedvideo", { withCredentials: true })
        setLikedVideo(result.data?.videos || result.data || [])

        const result1 = await axios.get(serverUrl + "/api/content/likedshort", { withCredentials: true })
        setLikedShort(result1.data?.shorts || result1.data || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchLikedContent()
  }, [])

  const totalCount = likedVideo.length + likedShort.length

  if (loading) {
    return (
      <div className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4'>
        <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-400 text-lg'>Loading liked content...</p>
      </div>
    )
  }

  if (likedShort.length === 0 && likedVideo.length === 0) {
    return (
      <div className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 text-gray-400'>
        <FaThumbsUp className='text-6xl text-gray-600' />
        <p className='text-xl font-semibold'>No Liked Content Yet</p>
        <p className='text-sm text-gray-500'>Videos and shorts you like will appear here.</p>
        <button
          onClick={() => navigate('/')}
          className='mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition'
        >
          Explore Videos
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0f0f0f] text-white'>

      {/* Top Bar */}
      <div className='sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 rounded-full hover:bg-[#272727] transition text-gray-400 hover:text-white'
        >
          <FaArrowLeft />
        </button>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center'>
            <FaThumbsUp className='text-orange-400 text-sm' />
          </div>
          <div>
            <h1 className='text-lg font-bold leading-tight'>Liked Content</h1>
            <p className='text-xs text-gray-500'>{totalCount} item{totalCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className='px-6 py-6 max-w-[1600px] mx-auto'>

        {/* Liked Shorts */}
        {likedShort.length > 0 && (
          <section className='mb-10'>
            <div className='flex items-center gap-2 mb-5 pb-3 border-b border-gray-800'>
              <SiYoutubeshorts className='text-orange-500 text-xl' />
              <h2 className='text-xl font-bold'>Liked Shorts</h2>
              <span className='ml-auto text-sm text-gray-500 bg-[#272727] px-3 py-0.5 rounded-full'>
                {likedShort.length}
              </span>
            </div>
            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
              {likedShort.map((short) => (
                <div key={short?._id} className='flex-shrink-0'>
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
          </section>
        )}

        {/* Liked Videos */}
        {likedVideo.length > 0 && (
          <section>
            <div className='flex items-center gap-2 mb-5 pb-3 border-b border-gray-800'>
              <GoVideo className='text-orange-500 text-xl' />
              <h2 className='text-xl font-bold'>Liked Videos</h2>
              <span className='ml-auto text-sm text-gray-500 bg-[#272727] px-3 py-0.5 rounded-full'>
                {likedVideo.length}
              </span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {likedVideo.map((video) => (
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
          </section>
        )}

      </div>
    </div>
  )
}

export default LikedContent