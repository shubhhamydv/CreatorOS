import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

import Describtion from '../../component/Describtion'
import { showCustomAlert } from '../../component/CustomAlert'
import { setChannelData } from '../../redux/userSlice'
import { serverUrl } from '../../App'

function CreatePlaylist() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoData, setVideoData] = useState([])
  const [selectedVideo, setSelectedVideo] = useState([])
  const [loading, setLoading] = useState(false)

  const { channelData } = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const toggleVideoSelect = (videoId) => {
    setSelectedVideo((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleCreatePlaylist = async () => {
    if (!channelData?._id) {
      showCustomAlert('Please create your channel first before creating a playlist.')
      return
    }

    if (!title.trim() || !description.trim()) {
      showCustomAlert('Please fill all fields')
      return
    }

    if (selectedVideo.length === 0) {
      showCustomAlert('Please select at least one video')
      return
    }

    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData?._id,
          videoIds: selectedVideo,
        },
        {
          withCredentials: true,
        }
      )

      const updatedChannel = {
        ...channelData,
        playlists: [
          ...(channelData?.playlists || []),
          result.data.playlist,
        ],
      }

      dispatch(setChannelData(updatedChannel))

      showCustomAlert('Playlist created successfully')
      navigate('/')
    } catch (error) {
      console.log(error)
      showCustomAlert('Create playlist error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (channelData?.videos) {
      setVideoData(channelData.videos)
    }
  }, [channelData])

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Create Playlist
          </h2>

          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={4}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Playlist Description*"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <p className="mb-3 text-lg font-semibold">
              Select Videos
            </p>

            {videoData?.length === 0 ? (
              <p className="text-sm text-gray-400">
                No videos found for this channel
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto">
                {videoData?.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => toggleVideoSelect(video._id)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedVideo.includes(video._id)
                        ? 'border-blue-500'
                        : 'border-gray-700'
                    }`}
                  >
                    <img
                      src={video?.thumbnail}
                      alt={video?.title}
                      className="w-full h-28 object-cover"
                    />

                    <p className="p-2 text-sm truncate">
                      {video?.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            disabled={!title || !description || loading}
            onClick={handleCreatePlaylist}
            className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            {loading ? (
              <ClipLoader size={20} color="black" />
            ) : (
              'Create Playlist'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default CreatePlaylist