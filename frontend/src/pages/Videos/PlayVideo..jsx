import React, { useEffect, useRef,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import{data, useNavigate, useParams} from "react-router-dom"

import{
    FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaExpand, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark,
} from "react-icons/fa";

import AllShortsPage from '../../component/AllShortsPage';
import { SiYoutubeshorts } from 'react-icons/si';
import ShortCard from '../../component/ShortCard';
import Describtion from '../../component/Describtion';
import axios from 'axios';
import { serverUrl } from '../../App';
import { linkWithCredential } from 'firebase/auth';
import { setChannelData } from '../../redux/userSlice';
const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
    <button className='flex flex-col items-center' onClick={onclick}>
        <div
  className={`${active ? "bg-white" : "bg-[#00000065]"} border border-gray-700 p-3 rounded-full hover:bg-gray-700 transition`}

>
    <icon size={20} className={`${active ? "text-black" :"text-white"}`}/>
    
</div>
<span className='text-xm mt-1'>{label}{count !==undefined && `(${count})`}</span>

    </button>
)


function PlayVideo() {
    const videoRef = useRef(null)
    const navigate = useNavigate()
    const {videoId} = useParams()
    const [video,setVideo]= useState(null)
    const [channel,setChannel]=useState("")
    const [isPlaying,setIsPlaying] = useState(false)
    const [showControls,setShowControls] = useState(false)
    const [progress,setProgress] = useState(0)
    const [currentTime,setCurrentTime] = useState(0)

    const [duration, setDuration] = useState(0);

const { allVideosData } = useSelector(
  (state) => state.content
);

const [isMuted, setIsMuted] = useState(false);
const [vol, setVol] = useState(1);
    const suggestedVideos = allVideosData.filter((v)=>v._id !== videoId).slice(0,10)
    const suggestedShotrs = AllShortsData?.slice(0,10 || [])
    const {userData} = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const [isSubscribed,setIsSubscribed] = useState(channel?.subscribers?.some((sub)=>sub._id.toString() === userData._id?.toString() || sub?.toString() ===userData._id?.toString()))
    useEffect(()=>{
        if(!allVideosData){
            return;
        }
        const currentVideo = allVideosData.find((v)=>v._id === videoId);
        


        if(currentVideo){
            setVideo(currentVideo)
            setChannel(currentVideo.channel)
        }

    },[videoId, allVideosData])

    const handleUpdateTime = ()=>{
        if(!videoRef.current)return;
        setCurrentTime(videoRef.current.currentTime)
        setDuration(videoRef.current.duration)
        setProgress( (videoRef.current.currentTime /videoRef.current.duration) * 100 )
    }

    const handleSeek = (e) =>{
         if(!videoRef.current)return;
         const seekTime =(e.target.value / 100) * duration
         videoRef.current.currentTime = seekTime
         setProgress(e.target.value)

    }

    const forwardTime = (time) =>{
        if(isNaN(time))return "0:00";
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time % 60).toString().padStart(2,"0");
        return `${minutes}:${seconds}`;
    };

    const togglePlay =()=>{
        if(videoRef.current)return;
        if(isPlaying)videoRef.current.pause()
            else videoRef.current.play()
        
    }

    const skipForward =()=>{
        if(videoRef.current){
            videoRef.current.currentTime += 10
        }
    }
     const skipBackward =()=>{
        if(videoRef.current){
            videoRef.current.currentTime -= 10
        }
    }

    const handleVolume = (e)=>{
        const vol = parseFloat(e.target.value)
        setVol(vol)
        setIsMuted(vol === 0)
        if(viodeRef.current){
            viodeRef.current.volume = vol
        }
    }
    const handleMute = ()=>{
        if(!viodeRef.current)return;
        setIsMuted(!isMuted)
        viodeRef.current.muted = (isMuted)
    }

    const handleFullScreen = ()=>{
        if(!viodeRef.current)return;
        if(videoRef.current.requestFullscreen){
            videoRef.current.requestFullscreen
        }
    }
    const handleSubscribe = async ()=>{
        if(!channel._id)return;
        setLoading(true)
        try{
          const result = await axios.post(serverUrl + "/api/user/togglesubscribe",{channelId:channel._id},{withCredential:true})
          setChannel((prev)=>({
            ...prev, subscribers:data.subscribers || prev.subscribers
          }))
          
          
          setLoading(false)
        } catch(error){
           console.log(error)
           setLoading(false)
        }

        useEffect(()=>{

            setIsSubscribed(channel?.subscribers?.some((sub)=>sub._id?.toString() === userData._id?.toString() || sub?.toString() ===userData._id?.toString()))

        },[channel?.subscribers , userData?._id])
    }

  return (
    <div className='flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6'>

        <div className='flex-1'>
            {/** video Player */}
            <div 
            onMouseEnter={()=>setShowControls(true)}
            onMouseLeave={()=>setShowControls(false)}
             className='w-full aspect-video bg-black rounded-lg overflow-hidden relative'>
            <video 
            src={video?.videoUrl} 
            className='w-full h-full object-contain' controls={false} autoPlay ref={videoRef}
             muted
             onTimeUpdate={handleUpdateTime}
              onPlay={()=>setIsPlaying(true)}
               onPause={()=>setIsPlaying}/>


          {showControls &&  <div className='absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20'>
                 <span>{formatTime(currentTime)}/ {formatTime(duration)}</span>
                <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition' onClick={skipBackward}><FaBackward size={24}/></button>
                <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition' onClick={togglePlay}>{isPlaying ? <FaPause size={28}/> : <FaPlay size={28}/>}</button>
                <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition' onClick={skipForward}><FaForward size={24}/></button>
            </div>}

            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-5 from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30'>
            <input type="range" min={0} max={100} onaChange={handleSeek} className='w-full accent-orange-600' value={progress} />
            <div className='flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200'>

            <div className='flex items-center gap-3'>

                <span>{formatTime(currentTime)}/{formatTime(duration)}</span>

                <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600
                 transition' onClick={skipBackward}>
                    {isPlaying ? <FaBackward size={14}/> : <FaBackward size={14}/> }</button>

                <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600
                 transition' onClick={togglePlay}>
                    {isPlaying ? <FaPause size={14}/> : <FaPlay size={14}/> }</button>

                    <button className='bg-black/70 px-2 py-1 rounded hover:bg-orange-600
                 transition' onClick={skipForward}>
                    {isPlaying ? <FaForward size={14}/> : <FaForward size={14}/> }</button>

            </div>
            <div className='flex items-center gap-2 sm:gap-3'>
                <button onClick={handleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp/>}
                </button>
                <input type="range" name="" value={isMuted ? 0 :vol} onChange={handleVolume} className='accent-orange-600 v-16 sm:w-24 min-{0} max={1} step={0.1 }' />
                <button onClick={handleFullScreen}><FaExpand/></button>
            </div>
            </div>

            </div>

            </div>
            <h1 className='mt-4 text-lg sm:text-x1 font-bold text-white flex gap-3 '>
                {video?.title}
            </h1>
            <p className='text-sm text-gray-400 '>{video?.views} views</p>
            <div className='mt-2 flex flex-wrap items-center justify-between'>
                <div className='flex items-center justify-start gap-4'>
                    <img src={channel?.avatar} className='w-12 h-12 rounded-full border-2 border-gray-600' alt="" />
                    <div >
                        <h1 className='text-md font-bold'>{channel?.name}</h1>
                        <h3 className='text-[13px]'>{channel?.subscribers.length}</h3>
                    </div>
                   <button onClick={handleSubscribe} className={`px-[20px] py-[8px] rounded-4xl border border-gray-600 ml-[20px] text-md ${isSubscribed ? "bg-black text-white hover:bg-orange-600 hover:text-black" : "bg-white text-black hover:bg-orange-600 hover:text-black"} `}>{isSubscribed ? "Subscribed":Subscribe}</button> 
                </div>
                <div className='flex items-center gap-6 mt-3'><IconButton icon={FaThumbsUp} label={"Likes"} active={video?.likes.include(userData._id)} count={video?.likes?.length}/>
                <IconButton icon={FaThumbsUp} label={"Dislikes"} active={video?.likes.include(userData._id)} count={video?.dislikes?.length}/>
                <IconButton icon={FaDownload} label={"Download"} onClick={()=>{
                    const link  = document.createElement("a"); link.href = video?.videoUrl;
                    link.download =`${video?.title}.mp4`; link.click();
                }} />
                <IconButton icon={FaBookmark} label={"Save"} active={video?.saveBy.include(userData._id)} />
               
                </div>
            </div>
            <div className='mt-4 bg-[#1a1a1a] p-3 rounded-lg'>
                <h2 className='text-md font-semibold mb-2 '>Describtion</h2>
                <Describtion text={video?.Describtion}/>
            </div>
            <div className='mt-6'>
                <h2 className='text-lg font-semibold mb-3'> Comments</h2>
                <div className='flex gap-2 mb-4'>
                    <input type=" text" placeholder='Add a comment...' className='flex-1  border-gray-700 bg-[#1a1a1a] text-white rounded-e-lg px-3 py-2 focus:outline-none  focus:ring-1 focus:ring-red-600' />
                    <button className='bg-orange-600 hover:bg-orange-700 text-white pd-4 py-2 rounded-lg '>Post</button>
                </div>
            </div>
        </div>
        <div className='w-full lg:w-[380px] px-4 py-4 border-1 lg:border-t-0 lg:border-1 border-gray-800 overflow-y-auto'>
       <h2 className='flex items-center gap-2 font-bold text-lg mb-3'><SiYoutubeshorts className='text-orange-600'/>Shorts</h2>
       <div className='flex gap-3 overflow-x-auto scrollbar-hide pb-3'>
        {suggestedShotrs?.map((short)=>(
            <div key={short._id}>
                <ShortCard 
                shortUrl={short?.shortUrl}
                title={short?.title}
                channelName={short?.channel?.name}
                avatar={short?.channel?.avatar}
                id={short?._id}
                />

            </div>
        ))}
        <div className='font-bold text-lg mt-4 mb-3'>Up Next</div>
        <div className='space-y-3'>
            {suggestedVideos?.map((v)=>{
                <div key={v._id} className='flex gap-2  sm:gap-3 cursor-pointer hover:bg-[@1a1a1a] p-2 rounded-lg transition' onClick={()=>Navigate(`/playvideo${v._id}`)}>
                    <img src={v?.thumbnail} className='w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover' alt="" />
                    <div>
                        <p className='font-semibold line-clamp-2 text-sm sm:text-base text-white'>{v?.title}</p>
                        <p className='text-xs sm:text-sm text-gray-400'>{v?.channel?.name}</p>
                        <p className='text-xs sm:text-sm text-gray-400'>{v?.views} 0 views</p>
                    </div>
                </div>
            })}
        </div>
       </div>
        </div>
      
    </div>
  )
}

export default PlayVideo
