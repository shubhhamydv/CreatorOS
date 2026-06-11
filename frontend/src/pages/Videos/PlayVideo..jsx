import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { data, useNavigate, useParams } from "react-router-dom"
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaExpand, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark } from "react-icons/fa";
import { SiYoutubeshorts } from 'react-icons/si';
import ShortCard from '../../component/ShortCard';
import Describtion from '../../component/Describtion';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { setAllVideosData } from '../../redux/contentSlice';

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
    <button className='flex flex-col items-center' onClick={onClick}>
        <div className={`${active ? "bg-white" : "bg-[#00000065]"} border border-gray-700 p-3 rounded-full hover:bg-gray-700 transition`}>
            <Icon size={20} className={`${active ? "text-black" : "text-white"}`} />
        </div>
        <span className='text-xm mt-1'>{label}{count !== undefined && `(${count})`}</span>
    </button>
)

const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
};

function PlayVideo() {
    const videoRef = useRef(null)
    const navigate = useNavigate()
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [channel, setChannel] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showControls, setShowControls] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [vol, setVol] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [comment, setComment] = useState([])
    const [newComment, setNewComment] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [viewCounted, setViewCounted] = useState(false)
    const dispatch = useDispatch()

    const { allVideosData, allShortsData } = useSelector((state) => state.content)
    const { userData } = useSelector(state => state.user)

    const suggestedVideos = allVideosData.filter((v) => v._id !== videoId).slice(0, 10)
    const suggestedShorts = (allShortsData || []).slice(0, 10)

    useEffect(() => {
        if (!allVideosData) return;
        const currentVideo = allVideosData.find((v) => v._id === videoId);
        if (currentVideo) {
            setVideo(currentVideo)
            setChannel(currentVideo.channel)
            setComment(currentVideo?.comments || [])
        }
    }, [videoId, allVideosData])

    useEffect(() => {
        setViewCounted(false)
    }, [videoId])

    useEffect(() => {
        if (!videoId || viewCounted) return;
        const addViews = async () => {
            try {
                const result = await axios.put(
                    `${serverUrl}/api/content/video/${videoId}/add-view`,
                    {},
                    { withCredentials: true }
                )
                setVideo((prev) => prev ? { ...prev, views: result.data.views } : prev)
                setViewCounted(true)
            } catch (error) {
                console.log(error)
            }
        }
        addViews()
    }, [videoId])

    useEffect(() => {
        setIsSubscribed(channel?.subscribers?.some((sub) =>
            sub._id?.toString() === userData?._id?.toString() ||
            sub?.toString() === userData?._id?.toString()
        ))
    }, [channel?.subscribers, userData?._id])

    const handleUpdateTime = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime)
        setDuration(videoRef.current.duration)
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
    }

    const handleSeek = (e) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = (e.target.value / 100) * duration
        setProgress(e.target.value)
    }

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause()
        else videoRef.current.play()
    }

    const skipForward = () => { if (videoRef.current) videoRef.current.currentTime += 10 }
    const skipBackward = () => { if (videoRef.current) videoRef.current.currentTime -= 10 }

    const handleVolume = (e) => {
        const newVol = parseFloat(e.target.value)
        setVol(newVol)
        setIsMuted(newVol === 0)
        if (videoRef.current) videoRef.current.volume = newVol
    }

    const handleMute = () => {
        if (!videoRef.current) return;
        setIsMuted(!isMuted)
        videoRef.current.muted = !isMuted
    }

    const handleFullScreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen()
    }

    const handleSubscribe = async () => {
        if (!channel?._id) return;
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/user/togglesubscribe", { channelId: channel._id }, { withCredentials: true })
            setChannel((prev) => ({ ...prev, subscribers: result.data.subscribers || prev.subscribers }))
        } catch (error) { console.log(error) }
        setLoading(false)
    }

    const toggleLike = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-like`, {}, { withCredentials: true })
            setVideo(result.data)
        } catch (error) { console.log(error) }
    }

    const toggleDislike = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-dislike`, {}, { withCredentials: true })
            setVideo(result.data)
        } catch (error) { console.log(error) }
    }

    const toggleSave = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-save`, {}, { withCredentials: true })
            setVideo(result.data)
        } catch (error) { console.log(error) }
    }

    const haddleAddComment = async () => {
        if (!newComment) return;
        setLoading1(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/content/video/${videoId}/add-comment`,
                { message: newComment },
                { withCredentials: true }
            )
            setComment(result.data?.comments || [])
            setNewComment("")
        } catch (error) { console.log(error) }
        setLoading1(false)
    }

    const haddleReply = async ({ commentId, replyText }) => {
        if (!replyText) return;
        setLoading3(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/content/video/${videoId}/${commentId}/add-reply`,
                { message: replyText },
                { withCredentials: true }
            )
            setComment(result.data?.comments || [])
        } catch (error) { console.log(error) }
        setLoading3(false)
    }

useEffect(() => {
  const addHistory = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/addhistory`,
        {
          contentId: videoId,
          contentType: "Video",
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  if (videoId) {
    addHistory();
  }
}, [videoId]);

useEffect(() => {
  setIsSubscribed(
    channel?.subscribers?.some(
      (sub) =>
        sub?._id?.toString() === userData?._id?.toString() ||
        sub?.toString() === userData?._id?.toString()
    )
  );
}, [channel?.subscribers, userData?._id]);


    return (
        <div className='flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6'>
            <div className='flex-1'>
                <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}
                    className='w-full aspect-video bg-black rounded-lg overflow-hidden relative'>
                    <video src={video?.videoUrl} className='w-full h-full object-contain' controls={false}
                        autoPlay ref={videoRef} muted onTimeUpdate={handleUpdateTime}
                        onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                    {showControls && (
                        <div className='absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 z-20'>
                            <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600' onClick={skipBackward}><FaBackward size={24} /></button>
                            <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600' onClick={togglePlay}>{isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}</button>
                            <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600' onClick={skipForward}><FaForward size={24} /></button>
                        </div>
                    )}
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30'>
                        <input type="range" min={0} max={100} onChange={handleSeek} className='w-full accent-orange-600' value={progress} />
                        <div className='flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200'>
                            <div className='flex items-center gap-3'>
                                <span>{formatTime(currentTime)}/{formatTime(duration)}</span>
                                <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600' onClick={skipBackward}><FaBackward size={14} /></button>
                                <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600' onClick={togglePlay}>{isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}</button>
                                <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600' onClick={skipForward}><FaForward size={14} /></button>
                            </div>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <button onClick={handleMute}>{isMuted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                                <input type="range" value={isMuted ? 0 : vol} onChange={handleVolume} className='accent-orange-600 w-16 sm:w-24' min={0} max={1} step={0.1} />
                                <button onClick={handleFullScreen}><FaExpand /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className='mt-4 text-lg sm:text-xl font-bold text-white'>{video?.title}</h1>
                <p className='text-sm text-gray-400'>{video?.views} views</p>
                <div className='mt-2 flex flex-wrap items-center justify-between'>
                    <div className='flex items-center justify-start gap-4'>
                        <img src={channel?.avatar} className='w-12 h-12 rounded-full border-2 border-gray-600' alt="" onClick={()=>navigate(`channelpage/${channel?._id}`)} />
                        <div>
                            <h1 className='text-md font-bold' onClick={()=>navigate(`channelpage/${channel?._id}`)} >{channel?.name}</h1>
                            <h3 className='text-[13px]'>{channel?.subscribers?.length} subscribers</h3>
                        </div>
                        <button onClick={handleSubscribe} className={`px-[20px] py-[8px] rounded-full border border-gray-600 ml-[20px] text-md ${isSubscribed ? "bg-black text-white hover:bg-orange-600" : "bg-white text-black hover:bg-orange-600"}`}>
                            {loading ? <ClipLoader size={20} color='black' /> : isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>
                    <div className='flex items-center gap-6 mt-3'>
                        <IconButton icon={FaThumbsUp} label={"Likes"} active={video?.likes?.includes(userData?._id)} count={video?.likes?.length} onClick={toggleLike} />
                        <IconButton icon={FaThumbsDown} label={"Dislikes"} active={video?.dislikes?.includes(userData?._id)} count={video?.dislikes?.length} onClick={toggleDislike} />
                        <IconButton icon={FaDownload} label={"Download"} onClick={() => { const l = document.createElement("a"); l.href = video?.videoUrl; l.download = `${video?.title}.mp4`; l.click(); }} />
                        <IconButton icon={FaBookmark} label={"Save"} active={video?.saveBy?.includes(userData?._id)} onClick={toggleSave} />
                    </div>
                </div>

                <div className='mt-4 bg-[#1a1a1a] p-3 rounded-lg'>
                    <h2 className='text-md font-semibold mb-2'>Description</h2>
                    <Describtion text={video?.description} />
                </div>

                <div className='mt-6'>
                    <h2 className='text-lg font-semibold mb-3'>Comments</h2>
                    <div className='flex gap-2 mb-4'>
                        <input type="text" placeholder='Add a comment...' className='flex-1 border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600'
                            onChange={(e) => setNewComment(e.target.value)} value={newComment} />
                        <button className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg' disabled={loading1} onClick={haddleAddComment}>
                            {loading1 ? <ClipLoader size={20} color='black' /> : "Post"}
                        </button>
                    </div>
                    <div className='space-y-3 max-h-[300px] overflow-y-auto pr-2'>
                        {comment?.map((c) => (
                            <div key={c?._id} className='p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm'>
                                <div className='flex items-center justify-start gap-1'>
                                    <img src={c?.author?.photoUrl} className='w-8 h-8 rounded-full object-cover' alt="" />
                                    <h2 className='text-[13px]'>@{c?.author?.userName?.toLowerCase()}</h2>
                                </div>
                                <p className='font-medium px-5 py-2'>{c?.message}</p>
                                <div className='ml-4 mt-2 space-y-2'>
                                    {c?.replies?.map((reply) => (
                                        <div key={reply._id} className='p-2 bg-[#2a2a2a] rounded'>
                                            <div className='flex items-center justify-start gap-1'>
                                                <img src={reply?.author?.photoUrl} className='w-6 h-6 rounded-full object-cover' alt="" />
                                                <h2 className='text-[13px]'>@{reply?.author?.userName?.toLowerCase()}</h2>
                                                <p className='px-3'>{reply?.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ReplySection comment={c} handleReply={haddleReply} loading3={loading3} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='w-full lg:w-[380px] px-4 py-4 border border-gray-800 overflow-y-auto'>
                <h2 className='flex items-center gap-2 font-bold text-lg mb-3'><SiYoutubeshorts className='text-orange-600' />Shorts</h2>
                <div className='flex gap-3 overflow-x-auto pb-3'>
                    {suggestedShorts?.map((short) => (
                        <div key={short._id}>
                            <ShortCard shortUrl={short?.shortUrl} title={short?.title} channelName={short?.channel?.name} avatar={short?.channel?.avatar} id={short?._id} views={short?.views} />
                        </div>
                    ))}
                </div>
                <div className='font-bold text-lg mt-4 mb-3'>Up Next</div>
                <div className='space-y-3'>
                    {suggestedVideos?.map((v) => (
                        <div key={v._id} className='flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition' onClick={() => navigate(`/playvideo/${v._id}`)}>
                            <img src={v?.thumbnail} className='w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover' alt="" />
                            <div>
                                <p className='font-semibold line-clamp-2 text-sm sm:text-base text-white'>{v?.title}</p>
                                <p className='text-xs sm:text-sm text-gray-400'>{v?.channel?.name}</p>
                                <p className='text-xs sm:text-sm text-gray-400'>{v?.views} views</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ReplySection = ({ comment, handleReply, loading3 }) => {
    const [replyText, setReplyText] = useState("")
    const [showReplyInput, setShowReplyInput] = useState(false)
    return (
        <div className='mt-3'>
            {showReplyInput && (
                <div className='flex gap-2 mt-1 ml-4'>
                    <input type="text" placeholder='Add a reply...' onChange={(e) => setReplyText(e.target.value)} value={replyText}
                        className='flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm' />
                    <button onClick={() => { handleReply({ commentId: comment._id, replyText }); setShowReplyInput(false); setReplyText("") }}
                        disabled={loading3} className='bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm'>
                        {loading3 ? <ClipLoader size={20} color='black' /> : "Reply"}
                    </button>
                </div>
            )}
            <button onClick={() => setShowReplyInput(!showReplyInput)} className='ml-4 text-xs text-gray-400 mt-1'>reply</button>
        </div>
    )
}

export default PlayVideo
