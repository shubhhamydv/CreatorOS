import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import { serverUrl } from "../../App"
import VideoCard from "../../component/VideoCard"
import ShortCard from "../../component/ShortCard"
import PlaylistCard from "../../component/PlaylistCard"
import PostCard from "../../component/PostCard"
import { setAllChannelData } from "../../redux/userSlice"
import { FaSearch, FaBell, FaUsers, FaVideo } from "react-icons/fa"
import { SiYoutubeshorts } from "react-icons/si"
import { MdVerified } from "react-icons/md"

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video")
  video.preload = "metadata"
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    const t = Math.floor(video.duration)
    callback(`${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`)
  }
  video.onerror = () => callback("0:00")
  video.src = url
}

const TABS = [
  { key: "home",      label: "Home" },
  { key: "videos",    label: "Videos" },
  { key: "shorts",    label: "Shorts" },
  { key: "playlists", label: "Playlists" },
  { key: "community", label: "Community" },
]

function ChannelPage() {
  const { channelId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { allChanneldata, userData } = useSelector((s) => s.user)

  const [channel, setChannel] = useState(null)
  const [activeTab, setActiveTab] = useState("home")
  const [subLoading, setSubLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [durations, setDurations] = useState({})
  const [videoSort, setVideoSort] = useState("latest")
  const [videoSearch, setVideoSearch] = useState("")

  /* ── Fetch channel ── */
  useEffect(() => {
    const found = (allChanneldata || []).find((c) => c._id === channelId)
    if (found) {
      setChannel(found)
    } else {
      setFetching(true)
      axios
        .get(`${serverUrl}/api/user/allchannel`, { withCredentials: true })
        .then((res) => {
          const list = res.data?.channels || []
          dispatch(setAllChannelData(list))
          const match = list.find((c) => c._id === channelId)
          if (match) setChannel(match)
        })
        .catch(console.log)
        .finally(() => setFetching(false))
    }
  }, [channelId, allChanneldata])

  /* ── Video durations ── */
  useEffect(() => {
    if (!channel?.videos?.length) return
    channel.videos.forEach((v) => {
      if (v?.videoUrl && v?._id && !durations[v._id]) {
        getVideoDuration(v.videoUrl, (t) =>
          setDurations((prev) => ({ ...prev, [v._id]: t }))
        )
      }
    })
  }, [channel?.videos])

  /* ── Reset search on tab change ── */
  useEffect(() => {
    setVideoSearch("")
    setVideoSort("latest")
  }, [activeTab])

  /* ── Subscribe toggle ── */
  const isSubscribed = channel?.subscribers?.some(
    (s) =>
      s?._id?.toString() === userData?._id?.toString() ||
      s?.toString() === userData?._id?.toString()
  )

  const handleSubscribe = async () => {
    if (!channel?._id) return
    setSubLoading(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId: channel._id },
        { withCredentials: true }
      )
      const updated = res.data?.channel || res.data
      setChannel((prev) => ({
        ...prev,
        subscribers: updated?.subscribers ?? prev.subscribers,
      }))
    } catch (e) { console.log(e) }
    setSubLoading(false)
  }

  /* ── Derived data ── */
  const allVideos    = channel?.videos    || []
  const allShorts    = channel?.shorts    || []
  const allPlaylists = channel?.playlists || []
  const allPosts     = [...(channel?.posts || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const filteredVideos = allVideos
    .filter((v) => v.title?.toLowerCase().includes(videoSearch.toLowerCase()))
    .sort((a, b) =>
      videoSort === "popular"
        ? (b.views || 0) - (a.views || 0)
        : new Date(b.createdAt) - new Date(a.createdAt)
    )

  const latestVideos  = [...allVideos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
  const popularVideos = [...allVideos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4)

  /* ── Loading / not found ── */
  if (fetching) return (
    <div className="flex justify-center items-center h-[80vh] bg-[#0f0f0f]">
      <ClipLoader size={40} color="#f97316" />
    </div>
  )

  if (!channel) return (
    <div className="flex justify-center items-center h-[80vh] bg-[#0f0f0f] text-gray-400 text-xl">
      Channel not found
    </div>
  )

  const subCount  = channel.subscribers?.length || 0
  const vidCount  = allVideos.length

  return (
    <div className="text-white min-h-screen bg-[#0f0f0f]">

      {/* ── BANNER ── */}
      <div className="w-full h-44 md:h-56 lg:h-64 relative overflow-hidden">
        {channel.banner ? (
          <img src={channel.banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-gray-900 to-black" />
        )}
        {/* Fade to page bg at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/10 to-transparent" />
      </div>

      {/* ── CHANNEL INFO ── */}
      <div className="px-4 md:px-10 flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-10 relative z-10 pb-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={channel.avatar || "https://placehold.co/100x100/1a1a1a/orange?text=CH"}
            alt=""
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#0f0f0f] shadow-2xl ring-2 ring-gray-700"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate">{channel.name}</h1>
            {subCount >= 1 && <MdVerified className="text-blue-400 text-xl flex-shrink-0" />}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <FaUsers size={12} className="text-gray-500" />
              <strong className="text-white">{subCount}</strong> subscriber{subCount !== 1 ? "s" : ""}
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center gap-1.5">
              <FaVideo size={12} className="text-gray-500" />
              <strong className="text-white">{vidCount}</strong> video{vidCount !== 1 ? "s" : ""}
            </span>
            {channel.category && (
              <>
                <span className="text-gray-700">•</span>
                <span className="capitalize text-gray-500">{channel.category}</span>
              </>
            )}
          </div>
          {channel.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2 max-w-xl">{channel.description}</p>
          )}
        </div>

        {/* Subscribe button */}
        <div className="flex items-center gap-2 pb-1 flex-shrink-0">
          {isSubscribed && (
            <button className="p-2.5 rounded-full bg-[#272727] hover:bg-[#333] border border-gray-700 text-gray-300 transition">
              <FaBell size={14} />
            </button>
          )}
          <button
            onClick={handleSubscribe}
            disabled={subLoading}
            className={`px-7 py-2.5 rounded-full font-semibold text-sm transition-all min-w-[120px] flex items-center justify-center gap-2 ${
              isSubscribed
                ? "bg-[#272727] text-white hover:bg-red-600/80 border border-gray-600"
                : "bg-white text-black hover:bg-gray-100 shadow-lg"
            }`}
          >
            {subLoading
              ? <ClipLoader size={15} color={isSubscribed ? "white" : "black"} />
              : isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="sticky top-[60px] bg-[#0f0f0f]/95 backdrop-blur z-30 border-b border-gray-800">
        <div className="flex overflow-x-auto scrollbar-hide px-4 md:px-10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 pt-1 px-5 font-medium text-sm whitespace-nowrap transition flex-shrink-0 ${
                activeTab === tab.key ? "text-white" : "text-gray-500 hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="px-4 md:px-10 py-7">

        {/* HOME */}
        {activeTab === "home" && (
          <div className="space-y-10">

            {latestVideos.length > 0 && (
              <section>
                <SectionHeader title="Latest Videos" onViewAll={() => setActiveTab("videos")} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {latestVideos.map((v) => (
                    <VideoCard key={v._id} id={v._id} thumbnail={v.thumbnail}
                      duration={durations[v._id] || "0:00"} channelLogo={channel.avatar}
                      title={v.title} channelName={channel.name} views={v.views} />
                  ))}
                </div>
              </section>
            )}

            {popularVideos.length > 0 && (
              <section>
                <SectionHeader title="Popular Uploads" onViewAll={() => { setActiveTab("videos"); setVideoSort("popular") }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {popularVideos.map((v) => (
                    <VideoCard key={v._id} id={v._id} thumbnail={v.thumbnail}
                      duration={durations[v._id] || "0:00"} channelLogo={channel.avatar}
                      title={v.title} channelName={channel.name} views={v.views} />
                  ))}
                </div>
              </section>
            )}

            {allShorts.length > 0 && (
              <section>
                <SectionHeader
                  title={<span className="flex items-center gap-2"><SiYoutubeshorts className="text-orange-500" /> Shorts</span>}
                  onViewAll={() => setActiveTab("shorts")}
                />
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allShorts.slice(0, 8).map((s) => (
                    <div key={s._id} className="flex-shrink-0">
                      <ShortCard id={s._id} shortUrl={s.shortUrl} title={s.title}
                        channelName={channel.name} views={s.views} avatar={channel.avatar} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {allPlaylists.length > 0 && (
              <section>
                <SectionHeader title="Playlists" onViewAll={() => setActiveTab("playlists")} />
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allPlaylists.slice(0, 6).map((p) => (
                    <div key={p._id} className="flex-shrink-0 w-52">
                      <PlaylistCard id={p._id} title={p.title} videos={p.videos || []} savedBy={p.savedBy || []} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {allPosts.length > 0 && (
              <section>
                <SectionHeader title="Community" onViewAll={() => setActiveTab("community")} />
                <div className="max-w-2xl">
                  <PostCard post={allPosts[0]} channelAvatar={channel.avatar} channelName={channel.name} />
                </div>
              </section>
            )}

            {allVideos.length === 0 && allShorts.length === 0 && allPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
                <FaVideo size={40} className="opacity-30" />
                <p className="text-lg">No content uploaded yet</p>
              </div>
            )}
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === "videos" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <span className="text-gray-500 text-sm">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-3 flex-wrap">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
                  <input
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="bg-[#1a1a1a] border border-gray-700 rounded-full pl-8 pr-4 py-2 text-sm text-white focus:outline-none focus:border-gray-500 w-44 transition"
                  />
                </div>
                <div className="flex bg-[#1a1a1a] border border-gray-700 rounded-full overflow-hidden">
                  {["latest", "popular"].map((s) => (
                    <button key={s} onClick={() => setVideoSort(s)}
                      className={`px-4 py-2 text-sm capitalize transition ${
                        videoSort === s ? "bg-white text-black font-semibold" : "text-gray-400 hover:text-white"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {filteredVideos.length === 0 ? (
              <EmptyState icon={<FaVideo size={36} />} message="No videos found" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredVideos.map((v) => (
                  <VideoCard key={v._id} id={v._id} thumbnail={v.thumbnail}
                    duration={durations[v._id] || "0:00"} channelLogo={channel.avatar}
                    title={v.title} channelName={channel.name} views={v.views} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SHORTS */}
        {activeTab === "shorts" && (
          <div>
            {allShorts.length === 0 ? (
              <EmptyState icon={<SiYoutubeshorts size={36} />} message="No Shorts uploaded yet" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {allShorts.map((s) => (
                  <ShortCard key={s._id} id={s._id} shortUrl={s.shortUrl} title={s.title}
                    channelName={channel.name} views={s.views} avatar={channel.avatar} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLAYLISTS */}
        {activeTab === "playlists" && (
          <div>
            {allPlaylists.length === 0 ? (
              <EmptyState message="No Playlists yet" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allPlaylists.map((p) => (
                  <PlaylistCard key={p._id} id={p._id} title={p.title}
                    videos={p.videos || []} savedBy={p.savedBy || []} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMMUNITY */}
        {activeTab === "community" && (
          <div className="max-w-2xl mx-auto">
            {/* Channel header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
              <img
                src={channel.avatar || "https://placehold.co/44x44"}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-700"
                alt=""
              />
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  {channel.name}
                  {subCount >= 1 && <MdVerified className="text-blue-400 text-sm" />}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {allPosts.length} post{allPosts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {allPosts.length === 0 ? (
              <EmptyState message="No community posts yet" />
            ) : (
              <div className="space-y-2">
                {allPosts.map((post) => (
                  <PostCard key={post._id} post={post}
                    channelAvatar={channel.avatar} channelName={channel.name} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

/* ── Small helpers ── */
function SectionHeader({ title, onViewAll }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold">{title}</h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs text-gray-500 hover:text-white transition px-3 py-1 rounded-full hover:bg-[#272727]"
        >
          View all →
        </button>
      )}
    </div>
  )
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-3">
      {icon && <span className="opacity-30">{icon}</span>}
      <p className="text-base">{message}</p>
    </div>
  )
}

export default ChannelPage