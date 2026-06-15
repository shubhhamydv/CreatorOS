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
import { FaSearch } from "react-icons/fa"
import { SiYoutubeshorts } from "react-icons/si"

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

  /* ── Fetch channel ─────────────────────────────────── */
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

  /* ── Durations ─────────────────────────────────────── */
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

  /* ── Reset search on tab change ────────────────────── */
  useEffect(() => {
    setVideoSearch("")
    setVideoSort("latest")
  }, [activeTab])

  /* ── Subscribe ─────────────────────────────────────── */
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
    } catch (e) {
      console.log(e)
    }
    setSubLoading(false)
  }

  /* ── Derived lists ─────────────────────────────────── */
  const allVideos = channel?.videos || []
  const allShorts = channel?.shorts || []
  const allPlaylists = channel?.playlists || []
  const allPosts = [...(channel?.posts || [])].sort(
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

  /* ─────────────────────────────────────────────────── */
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

  return (
    <div className="text-white min-h-screen bg-[#0f0f0f]">

      {/* BANNER */}
      <div className="w-full h-40 md:h-52 lg:h-60 relative overflow-hidden">
        {channel.banner ? (
          <img src={channel.banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
      </div>

      {/* CHANNEL INFO */}
      <div className="px-4 md:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 -mt-6 relative z-10 pb-4">
        <img
          src={channel.avatar || "https://placehold.co/100x100/1a1a1a/orange?text=CH"}
          alt=""
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#0f0f0f] flex-shrink-0 ring-2 ring-gray-700"
        />
        <div className="flex-1 min-w-0 mt-2">
          <h1 className="text-xl md:text-3xl font-extrabold truncate">{channel.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            @{channel.name?.toLowerCase().replace(/\s+/g, "")}&nbsp;•&nbsp;
            <span className="font-semibold text-white">{channel.subscribers?.length || 0}</span> subscribers&nbsp;•&nbsp;
            <span className="font-semibold text-white">{allVideos.length}</span> videos
          </p>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">{channel.category}</p>
          {channel.description && (
            <p className="text-gray-300 text-sm mt-2 line-clamp-2">{channel.description}</p>
          )}
        </div>
        <button
          onClick={handleSubscribe}
          disabled={subLoading}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all flex-shrink-0 mt-2 sm:mt-0 ${
            isSubscribed
              ? "bg-[#272727] text-white hover:bg-red-600 border border-gray-600"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {subLoading ? (
            <ClipLoader size={16} color={isSubscribed ? "white" : "black"} />
          ) : isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* TAB BAR */}
      <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-hide sticky top-[60px] bg-[#0f0f0f] z-30 px-4 md:px-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-3 px-4 font-medium text-sm whitespace-nowrap transition flex-shrink-0 ${
              activeTab === tab.key ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="px-4 md:px-8 py-6">

        {/* ── HOME ─────────────────────────────────────── */}
        {activeTab === "home" && (
          <div className="space-y-10">

            {latestVideos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">Latest Videos</h2>
                  <button onClick={() => setActiveTab("videos")} className="text-xs text-gray-400 hover:text-white">View all →</button>
                </div>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">Popular Uploads</h2>
                  <button onClick={() => { setActiveTab("videos"); setVideoSort("popular") }} className="text-xs text-gray-400 hover:text-white">View all →</button>
                </div>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <SiYoutubeshorts className="text-orange-500" /> Shorts
                  </h2>
                  <button onClick={() => setActiveTab("shorts")} className="text-xs text-gray-400 hover:text-white">View all →</button>
                </div>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">Playlists</h2>
                  <button onClick={() => setActiveTab("playlists")} className="text-xs text-gray-400 hover:text-white">View all →</button>
                </div>
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">Community</h2>
                  <button onClick={() => setActiveTab("community")} className="text-xs text-gray-400 hover:text-white">View all →</button>
                </div>
                <div className="max-w-2xl">
                  <PostCard post={allPosts[0]} channelAvatar={channel.avatar} channelName={channel.name} />
                </div>
              </section>
            )}

            {allVideos.length === 0 && allShorts.length === 0 && allPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                <p className="text-lg">No content uploaded yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── VIDEOS ───────────────────────────────────── */}
        {activeTab === "videos" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <span className="text-gray-400 text-sm">{filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}</span>
              <div className="flex gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input value={videoSearch} onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="bg-[#1a1a1a] border border-gray-700 rounded-full pl-8 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-gray-500 w-44" />
                </div>
                <div className="flex bg-[#1a1a1a] border border-gray-700 rounded-full overflow-hidden">
                  {["latest", "popular"].map((s) => (
                    <button key={s} onClick={() => setVideoSort(s)}
                      className={`px-4 py-1.5 text-sm capitalize transition ${videoSort === s ? "bg-white text-black font-semibold" : "text-gray-400 hover:text-white"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No videos found</div>
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

        {/* ── SHORTS ───────────────────────────────────── */}
        {activeTab === "shorts" && (
          <div>
            {allShorts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No Shorts uploaded yet</div>
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

        {/* ── PLAYLISTS ─────────────────────────────────── */}
        {activeTab === "playlists" && (
          <div>
            {allPlaylists.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No Playlists yet</div>
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

        {/* ── COMMUNITY ─────────────────────────────────── */}
        {activeTab === "community" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
              <img src={channel.avatar || "https://placehold.co/40x40"} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div>
                <p className="font-semibold text-sm">{channel.name}</p>
                <p className="text-gray-400 text-xs">{allPosts.length} post{allPosts.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {allPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No community posts yet</div>
            ) : (
              <div className="space-y-6">
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

export default ChannelPage