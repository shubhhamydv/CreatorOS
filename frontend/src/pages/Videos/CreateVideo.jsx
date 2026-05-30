import React, { useState } from 'react'
import { serverUrl } from '../../App'
import { linkWithCredential } from 'firebase/auth'
import { showCustomAlert } from '../../component/CustomAlert'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function CreateVideo() {
    const {channelData } =  useSelector(state=>state.user)
  const [videoUrl, setVideoUrl] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleVideo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoUrl(e.target.files[0])
    }
  }

  const handleThumbnail = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const handleUploadVideo = async ()=>{
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("tags",JSON.stringify(tags.split(",").map(tags.trim())))
    formData.append("video",videoUrl)
    formData.append("thumbnail",thumbnail)
    formData.append("channelId",channelData._id)
    try {
     const result = await axios.post(serverUrl+ "api/content/create-video",formData,{linkWithCredential:true})
     console.log(result.data)
     showCustomAlert("upload video successfully")
     loading(false)
     navigate("/")
     
    } catch(error){
        console.log(error)
        showCustomAlert(error.response.data.message)
        setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex justify-center items-center px-4">
      <div className="bg-[#212121] p-4 rounded-xl w-full max-w-sm shadow-lg space-y-4">

        <h2 className="text-lg font-semibold text-center">
          Upload Video
        </h2>

        {/* Video Upload */}
        <div>
          <label
            htmlFor="video"
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-3 hover:border-orange-500 transition"
          >
            <p className="text-gray-400 text-sm">
              Click to upload video
            </p>

            {videoUrl && (
              <p className="mt-2 text-green-400 text-xs text-center break-all">
                {videoUrl.name}
              </p>
            )}
          </label>

          <input
            type="file"
            id="video"
            className="hidden"
            accept="video/*"
            onChange={handleVideo}
          />
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 text-sm rounded-lg bg-[#121212] border border-gray-700 outline-none focus:border-orange-500"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 text-sm rounded-lg bg-[#121212] border border-gray-700 outline-none focus:border-orange-500 resize-none"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 text-sm rounded-lg bg-[#121212] border border-gray-700 outline-none focus:border-orange-500"
        />

        {/* Thumbnail Upload */}
        <div>
          <label htmlFor="thumbnail" className="cursor-pointer block">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail"
                className="w-full h-28 object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <div className="w-full h-24 bg-[#121212] rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 text-sm">
                Upload Thumbnail
              </div>
            )}
          </label>

          <input
            type="file"
            id="thumbnail"
            className="hidden"
            accept="image/*"
            onChange={handleThumbnail}
          />
        </div>

        {/* Upload Button */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-medium text-sm transition">
          Upload
        </button>

      </div>
    </div>
  )
}

export default CreateVideo