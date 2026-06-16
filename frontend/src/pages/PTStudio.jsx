import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import {
  FaTachometerAlt, FaVideo, FaChartBar, FaDollarSign,
  FaEye, FaThumbsUp, FaThumbsDown, FaComment, FaUsers,
  FaPlus, FaEdit, FaTrash, FaClock,
} from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

/* ─── helpers ─────────────────────────────────────────────── */
function fmtViews(n = 0) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

/* ─── mock subscriber growth data ────────────────────────── */
function buildGrowthData(subCount) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months.slice(0, 8).map((m, i) => ({
    month: m,
    subscribers: Math.max(0, Math.round((subCount / 8) * (i + 1) * (0.7 + Math.random() * 0.6))),
    views: Math.round(Math.random() * 8000 + 1000),
  }));
}

/* ─── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, sub }) {
  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-2xl font-semibold text-white">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

/* ─── Video row ───────────────────────────────────────────── */
function VideoRow({ video, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-lg p-3 transition-colors group">
      {/* thumbnail */}
      <div
        className="w-24 h-14 rounded-md overflow-hidden flex-shrink-0 cursor-pointer relative"
        onClick={() => navigate(`/playvideo/${video._id}`)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = "https://via.placeholder.com/96x54/1a1a1a/555?text=No+Thumb"; }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-lg">▶</span>
        </div>
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate cursor-pointer hover:text-blue-400"
          onClick={() => navigate(`/playvideo/${video._id}`)}>
          {video.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Published {fmtDate(video.createdAt)}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1"><FaEye className="text-[10px]" />{fmtViews(video.views)}</span>
          <span className="flex items-center gap-1"><FaThumbsUp className="text-[10px]" />{video.likes?.length ?? 0}</span>
          <span className="flex items-center gap-1"><FaThumbsDown className="text-[10px]" />{video.dislikes?.length ?? 0}</span>
          <span className="flex items-center gap-1"><FaComment className="text-[10px]" />{video.comments?.length ?? 0}</span>
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          className="p-1.5 rounded bg-[#333] hover:bg-blue-600 transition-colors text-white text-xs"
          title="Edit"
          onClick={() => navigate(`/playvideo/${video._id}`)}
        ><FaEdit /></button>
        <button
          className="p-1.5 rounded bg-[#333] hover:bg-red-600 transition-colors text-white text-xs"
          title="Delete"
          onClick={() => onDelete(video._id)}
        ><FaTrash /></button>
      </div>
    </div>
  );
}

/* ─── Short row ───────────────────────────────────────────── */
function ShortRow({ short }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] rounded-lg p-3 transition-colors group">
      <div
        className="w-10 h-14 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => navigate("/shorts")}
      >
        <video
          src={short.shortUrl}
          muted
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{short.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">Published {fmtDate(short.createdAt)}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1"><FaEye className="text-[10px]" />{fmtViews(short.views)}</span>
          <span className="flex items-center gap-1"><FaThumbsUp className="text-[10px]" />{short.likes?.length ?? 0}</span>
          <span className="flex items-center gap-1"><FaComment className="text-[10px]" />{short.comments?.length ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function PTStudio() {
  const navigate = useNavigate();
  const { channelData, userData } = useSelector((s) => s.user);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState([]);

  /* fetch channel's own videos + shorts */
  useEffect(() => {
    if (!channelData?._id) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [vRes, sRes] = await Promise.all([
          axios.get(`${serverUrl}/api/content/getallvideos`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/content/getallshorts`, { withCredentials: true }),
        ]);

        const allVideos = vRes.data?.videos ?? (Array.isArray(vRes.data) ? vRes.data : []);
        const allShorts = sRes.data?.shorts ?? (Array.isArray(sRes.data) ? sRes.data : []);

        /* filter to own channel */
        const myVideos = allVideos.filter(
          (v) => v.channel?._id === channelData._id || v.channel === channelData._id
        );
        const myShorts = allShorts.filter(
          (s) => s.channel?._id === channelData._id || s.channel === channelData._id
        );

        setVideos(myVideos);
        setShorts(myShorts);
        setGrowthData(buildGrowthData(channelData.subscribers?.length ?? 0));
      } catch (err) {
        console.error("PTStudio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelData]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(`${serverUrl}/api/content/deletevideo/${videoId}`, {
        withCredentials: true,
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ── derived stats ── */
  const totalViews = videos.reduce((s, v) => s + (v.views ?? 0), 0)
    + shorts.reduce((s, sh) => s + (sh.views ?? 0), 0);
  const subCount = channelData?.subscribers?.length ?? 0;
  const estRevenue = ((totalViews / 1000) * 2.5).toFixed(2);

  /* ── nav items ── */
  const navItems = [
    { key: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { key: "content",   icon: <FaVideo />,         label: "Content"   },
    { key: "analytics", icon: <FaChartBar />,       label: "Analytics" },
    { key: "revenue",   icon: <FaDollarSign />,     label: "Revenue"   },
  ];

  /* ─── NO CHANNEL state ──────────────────────────────────── */
  if (!channelData) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 text-white">
        <SiYoutubestudio className="text-orange-500 text-5xl" />
        <h2 className="text-xl font-semibold">You don't have a channel yet</h2>
        <p className="text-gray-400 text-sm">Create a channel to access PT Studio</p>
        <button
          onClick={() => navigate("/createchannel")}
          className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-semibold transition"
        >
          Create Channel
        </button>
      </div>
    );
  }

  /* ─── MAIN LAYOUT ───────────────────────────────────────── */
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">

      {/* ══ TOP HEADER ══════════════════════════════════════════ */}
      <header className="h-14 px-5 flex items-center justify-between border-b border-[#272727] bg-[#0f0f0f] sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <SiYoutubestudio className="text-orange-500 text-2xl" />
          <span className="font-bold text-base tracking-tight">
            PT <span className="text-white">Studio</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#3a3a3a] text-white px-4 py-1.5 rounded-full text-sm font-medium transition"
          >
            <FaPlus className="text-xs" /> Create
          </button>
          {userData?.photoUrl
            ? <img src={userData.photoUrl} className="w-8 h-8 rounded-full object-cover border border-[#444]" alt="me" />
            : <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-xs">
                {userData?.userName?.[0]?.toUpperCase()}
              </div>
          }
        </div>
      </header>

      <div className="flex flex-1">

        {/* ══ SIDEBAR ══════════════════════════════════════════ */}
        <aside className="w-[200px] border-r border-[#272727] bg-[#0f0f0f] flex flex-col sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">

          {/* channel identity */}
          <div className="flex flex-col items-center py-6 px-3 border-b border-[#272727]">
            {channelData?.avatar
              ? <img src={channelData.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-[#444]" alt={channelData.name} />
              : <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                  {channelData?.name?.[0]?.toUpperCase()}
                </div>
            }
            <p className="mt-2 font-bold text-sm text-center leading-tight line-clamp-2">
              {channelData?.name}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Your Channel</p>
          </div>

          {/* nav */}
          <nav className="py-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-colors relative
                  ${activeTab === item.key
                    ? "bg-[#272727] text-white"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"}`}
              >
                {activeTab === item.key && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-white rounded-r" />
                )}
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ══ MAIN CONTENT ═════════════════════════════════════ */}
        <main className="flex-1 min-w-0 p-6 overflow-y-auto">

          {/* ── DASHBOARD tab ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* channel header */}
              <div className="flex items-center gap-4">
                {channelData?.avatar
                  ? <img src={channelData.avatar} className="w-12 h-12 rounded-full object-cover" alt={channelData.name} />
                  : <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                      {channelData?.name?.[0]?.toUpperCase()}
                    </div>
                }
                <div>
                  <h2 className="font-bold text-lg leading-tight">{channelData?.name}</h2>
                  <p className="text-gray-400 text-sm">{subCount} Total subscriber{subCount !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* ── analytics strip ── */}
              <div>
                <h3 className="font-semibold text-sm text-gray-300 mb-3">Channel Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatCard label="Views" value={totalViews.toLocaleString()} />
                  <StatCard label="Subscribers" value={`+${subCount}`} />
                  <StatCard label="Estimated revenue" value={`+$${estRevenue}`} />
                </div>
              </div>

              {/* ── latest content ── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* latest videos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-gray-300">Latest Videos</h3>
                    <button
                      onClick={() => setActiveTab("content")}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {loading ? (
                    <SkeletonList count={4} />
                  ) : videos.length === 0 ? (
                    <EmptyState label="No videos uploaded yet" onClick={() => navigate("/createvideo")} btnLabel="Upload video" />
                  ) : (
                    <div className="space-y-2">
                      {videos.slice(0, 5).map((v) => (
                        <VideoRow key={v._id} video={v} onDelete={handleDeleteVideo} />
                      ))}
                    </div>
                  )}
                </div>

                {/* latest shorts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-gray-300">Latest Shorts</h3>
                    <button
                      onClick={() => setActiveTab("content")}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {loading ? (
                    <SkeletonList count={3} />
                  ) : shorts.length === 0 ? (
                    <EmptyState label="No shorts uploaded yet" onClick={() => navigate("/createshort")} btnLabel="Upload short" />
                  ) : (
                    <div className="space-y-2">
                      {shorts.slice(0, 5).map((s) => (
                        <ShortRow key={s._id} short={s} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CONTENT tab ── */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Your Content</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/createvideo")}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    <FaPlus className="text-xs" /> Video
                  </button>
                  <button
                    onClick={() => navigate("/createshort")}
                    className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    <FaPlus className="text-xs" /> Short
                  </button>
                </div>
              </div>

              <section>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Videos ({videos.length})
                </h3>
                {loading ? <SkeletonList count={5} /> : videos.length === 0
                  ? <EmptyState label="No videos yet" onClick={() => navigate("/createvideo")} btnLabel="Upload your first video" />
                  : <div className="space-y-2">
                      {videos.map((v) => (
                        <VideoRow key={v._id} video={v} onDelete={handleDeleteVideo} />
                      ))}
                    </div>
                }
              </section>

              {shorts.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Shorts ({shorts.length})
                  </h3>
                  <div className="space-y-2">
                    {shorts.map((s) => <ShortRow key={s._id} short={s} />)}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── ANALYTICS tab ── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg">Analytics</h2>

              {/* summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Total views" value={totalViews.toLocaleString()} sub="All time" />
                <StatCard label="Subscribers" value={subCount.toLocaleString()} sub="Total" />
                <StatCard label="Videos" value={videos.length} sub="Published" />
                <StatCard label="Shorts" value={shorts.length} sub="Published" />
              </div>

              {/* Subscriber growth chart */}
              <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Subscriber Growth</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" tick={{ fill: "#aaa", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="subscribers" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Views chart */}
              <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Monthly Views</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" tick={{ fill: "#aaa", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#aaa", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="views" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 5 videos */}
              {videos.length > 0 && (
                <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Videos by Views</h3>
                  <div className="space-y-3">
                    {[...videos].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5).map((v, i) => (
                      <div key={v._id} className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-5 text-right">{i + 1}</span>
                        <img src={v.thumbnail} alt={v.title}
                          className="w-14 h-9 rounded object-cover bg-[#333]"
                          onError={e => { e.target.src = "https://via.placeholder.com/56x36/1a1a1a/555?text=N"; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{v.title}</p>
                        </div>
                        <span className="text-sm text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <FaEye className="text-xs" /> {fmtViews(v.views)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── REVENUE tab ── */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <h2 className="font-bold text-lg">Revenue</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                  label="Estimated total revenue"
                  value={`$${estRevenue}`}
                  sub="CPM model · all time"
                />
                <StatCard
                  label="Total views"
                  value={totalViews.toLocaleString()}
                  sub="Monetized views"
                />
                <StatCard
                  label="RPM"
                  value="$2.50"
                  sub="Per 1,000 views"
                />
              </div>

              <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Monthly Revenue Estimate</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={growthData.map(d => ({
                      ...d,
                      revenue: parseFloat(((d.views / 1000) * 2.5).toFixed(2)),
                    }))}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" tick={{ fill: "#aaa", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#aaa", fontSize: 11 }} unit="$" />
                    <Tooltip
                      formatter={(v) => [`$${v}`, "Revenue"]}
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-5 text-sm text-gray-400 leading-relaxed">
                <p className="font-medium text-gray-300 mb-1">How is this calculated?</p>
                Revenue = (Total Views ÷ 1,000) × $2.50 CPM.
                This is a mock estimate. Actual YouTube revenue varies by niche, geography, ad type, and season.
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* ─── minor helper components ─────────────────────────────── */
function SkeletonList({ count }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1a1a1a] rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ label, onClick, btnLabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center border border-dashed border-[#333] rounded-xl">
      <FaVideo className="text-3xl text-gray-600" />
      <p className="text-gray-400 text-sm">{label}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
      >
        {btnLabel}
      </button>
    </div>
  );
}
