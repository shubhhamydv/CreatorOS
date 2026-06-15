import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import { FaPlay, FaPause, FaComment, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark } from "react-icons/fa"
import { FaArrowDown } from "react-icons/fa"
import Describtion from "../../component/Describtion"
import axios from "axios"
import { serverUrl } from "../../App"
import { ClipLoader } from "react-spinners"

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button className='flex flex-col items-center gap-1' onClick={onClick}>
    <div className={`${active ? "bg-white" : "bg-[#00000065]"} border border-gray-700 p-2 rounded-full hover:bg-gray-700 transition`}>
      <Icon size={18} className={`${active ? "text-black" : "text-white"}`} />
    </div>
    <span className='text-xs text-white'>{label}{count !== undefined ? `(${count})` : ""}</span>
  </button>
)

function Shorts() {
  const { allShortsData } = useSelector((state) => state.content)
  const { userData } = useSelector((state) => state.user)

  const [shortList, setShortList] = useState([])
  const [playIndex, setPlayIndex] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openComment, setOpenComment] = useState(null)
  const [viewedShort, setViewedShort] = useState([])
  const [comment, setComment] = useState({})
  const [newComment, setNewComment] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const shortRefs = useRef([])
  const containerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubscribe = async (channelId) => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/togglesubscribe", { channelId }, { withCredentials: true })
      const updatedChannel = result.data?.channel || result.data
      setShortList((prev) => prev.map((short) => short?.channel?._id === channelId ? { ...short, channel: updatedChannel } : short))
    } catch (error) { console.log(error) }
    setLoading(false)
  }

  const handleAddView = async (shortId) => {
    try {
      await axios.put(`${serverUrl}/api/content/short/${shortId}/add-view`, {}, { withCredentials: true })
    } catch (error) { console.log(error) }
  }

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-like`, {}, { withCredentials: true })
      const updatedShort = result.data?.short || result.data
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short))
    } catch (error) { console.log(error) }
  }

  const toggleDislike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-dislike`, {}, { withCredentials: true })
      const updatedShort = result.data?.short || result.data
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short))
    } catch (error) { console.log(error) }
  }

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-save`, {}, { withCredentials: true })
      const updatedShort = result.data?.short || result.data
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short))
    } catch (error) { console.log(error) }
  }

  const handleAddComment = async (shortId) => {
    if (!newComment) return
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/add-comment`, { message: newComment }, { withCredentials: true })
      const updatedShort = result.data?.short || result.data
      setComment((prev) => ({ ...prev, [shortId]: updatedShort.comments || [] }))
      setShortList((prev) => prev.map((s) => s._id === shortId ? updatedShort : s))
      setNewComment("")
    } catch (error) { console.log(error) }
    setLoading(false)
  }

  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return
    const params = new URLSearchParams(location.search)
    const shortId = params.get('shortId')

    let listToSet = [...allShortsData]
    if (!shortId) {
      listToSet = listToSet.sort(() => Math.random() - 0.5)
    }
    setShortList(listToSet)

    const existingComments = {}
    allShortsData.forEach((short) => {
      if (short?.comments?.length > 0) {
        existingComments[short._id] = short.comments
      }
    })
    setComment(existingComments)

    if (shortId) {
      setTimeout(() => {
        const index = listToSet.findIndex(s => s._id === shortId)
        if (index >= 0 && containerRef.current) {
          const children = containerRef.current.querySelectorAll('.snap-start')
          const el = children[index]
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [allShortsData, location.search])

  // History tracking when activeIndex changes
  useEffect(() => {
    const addHistory = async () => {
      const shortId = shortList[activeIndex]?._id
      if (!shortId) return
      try {
        await axios.post(
          `${serverUrl}/api/user/add-history`,
          { contentId: shortId, contentType: "Short" },
          { withCredentials: true }
        )
      } catch (error) {
        console.log("Error adding short history:", error)
      }
    }
    if (shortList.length > 0) {
      addHistory()
    }
  }, [activeIndex, shortList])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index)
        const video = shortRefs.current[index]
        if (!video) return
        if (entry.isIntersecting) {
          video.muted = false
          video.play().catch(() => {})
          setActiveIndex(index)
          const currentShortId = shortList[index]?._id
          if (currentShortId && !viewedShort.includes(currentShortId)) {
            handleAddView(currentShortId)
            setViewedShort((prev) => [...prev, currentShortId])
          }
        } else {
          video.pause()
          video.muted = true
        }
      })
    }, { threshold: 0.7 })

    shortRefs.current.forEach((video) => { if (video) observer.observe(video) })
    return () => observer.disconnect()
  }, [shortList])

  const togglePlay = (index) => {
    const video = shortRefs.current[index]
    if (!video) return
    if (video.paused) { video.play().catch(() => {}); setPlayIndex(null) }
    else { video.pause(); setPlayIndex(index) }
  }

  const paramsCheck = new URLSearchParams(location.search)
  const deepShortId = paramsCheck.get('shortId')

  if (deepShortId && (!allShortsData || allShortsData.length === 0)) {
    return <div className="h-screen w-full flex items-center justify-center"><ClipLoader size={40} color="white" /></div>
  }

  if (deepShortId && allShortsData && allShortsData.length > 0) {
    const exists = allShortsData.some(s => s._id === deepShortId)
    if (!exists) {
      return (
        <div className="h-screen w-full flex items-center justify-center text-white">
          <div className="bg-[#121212] p-6 rounded-lg shadow">Requested short not found.</div>
        </div>
      )
    }
  }

  return (
    <div ref={containerRef} className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div key={short?._id} className="min-h-screen flex justify-center items-center snap-start">
          <div className="relative w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden" onClick={() => togglePlay(index)}>
            <video
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
              src={short?.shortUrl}
              className="w-full h-full object-cover"
              loop muted playsInline
            />

            {playIndex === index ? (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"><FaPlay className="text-white" /></div>
            ) : (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"><FaPause className="text-white" /></div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={short?.channel?.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(`/channelpage/${short?.channel?._id}`) }}
                />
                <span
                  className="text-sm text-gray-300 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(`/channelpage/${short?.channel?._id}`) }}
                >
                  @{short?.channel?.name?.toLowerCase()}
                </span>
                <button
                  className={`${short?.channel?.subscribers?.includes(userData?._id) ? "bg-[#000000a1] text-white border border-gray-700" : "bg-white text-black"} text-xs px-4 py-2 rounded-full cursor-pointer`}
                  onClick={(e) => { e.stopPropagation(); handleSubscribe(short?.channel?._id) }}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={15} color="gray" /> : short?.channel?.subscribers?.includes(userData?._id) ? "Subscribed" : "Subscribe"}
                </button>
              </div>
              <h3 className="font-bold">{short?.title}</h3>
              {short?.tags && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {short.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              <Describtion text={short?.description} />
            </div>

            <div className='absolute right-3 bottom-28 flex flex-col items-center gap-4 text-white' onClick={(e) => e.stopPropagation()}>
              <IconButton icon={FaThumbsUp} label={"Likes"} active={short?.likes?.includes(userData?._id)} count={short?.likes?.length} onClick={() => toggleLike(short._id)} />
              <IconButton icon={FaThumbsDown} label={"Dislikes"} active={short?.dislikes?.includes(userData?._id)} count={short?.dislikes?.length} onClick={() => toggleDislike(short._id)} />
              <IconButton icon={FaDownload} label={"Download"} onClick={() => { const l = document.createElement("a"); l.href = short?.shortUrl; l.download = `${short?.title}.mp4`; l.click() }} />
              <IconButton icon={FaComment} label={"Comment"} onClick={() => setOpenComment(openComment === short._id ? null : short._id)} />
              <IconButton icon={FaBookmark} label={"Save"} active={short?.saveBy?.includes(userData?._id)} onClick={() => toggleSave(short._id)} />
            </div>

            {openComment === short._id && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto z-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button onClick={() => setOpenComment(null)}><FaArrowDown size={20} /></button>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                  />
                  <button className="bg-black px-4 py-2 border border-gray-700 rounded-xl" onClick={() => handleAddComment(short._id)}>Post</button>
                </div>
                <div className="space-y-3 mt-4">
                  {comment[short._id]?.length > 0
                    ? comment[short._id].map((c, i) => (
                      <div key={i} className="bg-gray-800 p-2 rounded text-sm">{c?.message}</div>
                    ))
                    : <p className="text-sm text-gray-400">No comments yet.</p>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Shorts
