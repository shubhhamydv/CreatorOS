import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { SiYoutubeshorts } from 'react-icons/si'
import { GoVideo } from 'react-icons/go'
import ShortCard from '../component/ShortCard'
import VideoCard from '../component/VideoCard'

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

  video.onerror = () => {
    callback("0:00")
  }

  video.src = url
}

function SavedContent() {
  const [savedVideo, setSavedVideo] = useState([])
  const [savedShort, setSavedShort] = useState([])
  const [durations, setDurations] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const videoResult = await axios.get(
          `${serverUrl}/api/content/savedvideo`,
          { withCredentials: true }
        )

        setSavedVideo(videoResult.data || [])

        const shortResult = await axios.get(
          `${serverUrl}/api/content/savedshort`,
          { withCredentials: true }
        )

        setSavedShort(shortResult.data || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedContent()
  }, [])

  useEffect(() => {
    if (savedVideo.length > 0) {
      savedVideo.forEach((video) => {
        if (video?.videoUrl && video?._id) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }))
          })
        }
      })
    }
  }, [savedVideo])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl">
        Loading...
      </div>
    )
  }

  if ((!savedVideo &&  !savedShort) || (savedVideo.length === 0 && savedShort.length === 0)) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        No Saved Content Found
      </div>
    )
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">
      
      {/* Saved Shorts */}
      {savedShort.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2">
            <SiYoutubeshorts />
            Saved Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {savedShort.map((short) => (
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

      {/* Saved Videos */}
      {savedVideo.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2">
            <GoVideo />
            Saved Videos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedVideo.map((video) => (
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
    </div>
  )
}

export default SavedContent