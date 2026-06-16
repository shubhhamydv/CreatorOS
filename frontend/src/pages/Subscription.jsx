import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import VideoCard from "../components/common/VideoCard";
import { VideoCardSkeleton } from "../components/common/Skeletons";
import { formatViews, timeAgo, formatDuration, getAvatar } from "../utils/helpers";
import { MdVerified, MdPlayArrow } from "react-icons/md";

// Short card — vertical 9:16
function ShortCard({ short }) {
  return (
    <div className="group relative flex-shrink-0 w-36 cursor-pointer">
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-pt-card">
        <img
          src={short.thumbnail || "https://via.placeholder.com/180x320/1a1a1a/aaa?text=Short"}
          alt={short.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MdPlayArrow size={22} className="text-white ml-0.5" />
          </div>
        </div>
        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug">{short.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <img
              src={getAvatar(short.channel?.avatar)}
              alt={short.channel?.name}
              className="w-4 h-4 rounded-full"
            />
            <span className="text-white/70 text-[10px] truncate">{short.channel?.name}</span>
          </div>
          <p className="text-white/60 text-[10px] mt-0.5">{formatViews(short.views)} views</p>
        </div>
      </div>
    </div>
  );
}

// Subscribed channel avatar row item
function ChannelAvatar({ channel }) {
  return (
    <Link
      to={`/channel/${channel._id}`}
      className="flex flex-col items-center gap-1.5 group flex-shrink-0"
    >
      <div className="relative">
        <img
          src={getAvatar(channel.avatar)}
          alt={channel.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-pt-border group-hover:ring-pt-accent transition-all"
        />
        {channel.isVerified && (
          <MdVerified
            size={14}
            className="absolute -bottom-0.5 -right-0.5 text-pt-accent bg-pt-bg rounded-full"
          />
        )}
      </div>
      <span className="text-xs text-pt-muted group-hover:text-pt-text transition-colors text-center w-16 truncate">
        {channel.name}
      </span>
    </Link>
  );
}

// Section heading with icon
function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-pt-accent text-lg">{icon}</span>
      <h2 className="font-bold text-lg">{title}</h2>
    </div>
  );
}

// Skeleton for shorts row
function ShortsSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36">
          <div className="skeleton aspect-[9/16] rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default function Subscriptions() {
  const [data, setData] = useState({ videos: [], shorts: [], channels: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/videos/subscriptions")
      .then((r) => {
        setData({
          videos: r.data.videos || [],
          shorts: r.data.shorts || [],
          channels: r.data.channels || [],
        });
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Failed to load subscriptions");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── No subscriptions at all ──────────────────────────────────────
  if (!loading && data.channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-pt-muted animate-fade-in">
        <div className="text-7xl mb-5">📺</div>
        <h2 className="text-xl font-semibold text-pt-text mb-2">
          Subscribe to channels you like
        </h2>
        <p className="text-sm text-center max-w-sm">
          Videos from channels you subscribe to will appear here. Start by exploring the home
          page!
        </p>
        <Link to="/" className="btn-primary mt-6">
          Explore videos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Subscribed Channels Row ─────────────────────────────── */}
      {loading ? (
        <div className="flex gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="skeleton w-14 h-14 rounded-full" />
              <div className="skeleton h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {data.channels.map((ch) => (
            <ChannelAvatar key={ch._id} channel={ch} />
          ))}
        </div>
      )}

      {/* ── Subscribed Shorts ───────────────────────────────────── */}
      {(loading || data.shorts.length > 0) && (
        <section>
          <SectionHeading icon="⚡" title="Subscribed Shorts" />
          {loading ? (
            <ShortsSkeleton />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              {data.shorts.map((short) => (
                <ShortCard key={short._id} short={short} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Subscribed Videos ───────────────────────────────────── */}
      <section>
        <SectionHeading icon="▶" title="Subscribed Videos" />
        {loading ? (
          <div className="video-grid">
            <VideoCardSkeleton count={8} />
          </div>
        ) : data.videos.length === 0 ? (
          <div className="text-center py-12 text-pt-muted">
            <p className="text-4xl mb-3">🎬</p>
            <p>No videos from your subscriptions yet.</p>
            <p className="text-sm mt-1">Check back later — your channels haven't uploaded recently.</p>
          </div>
        ) : (
          <div className="video-grid">
            {data.videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        )}
      </section>

      {/* error toast-style fallback */}
      {error && !loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
}
