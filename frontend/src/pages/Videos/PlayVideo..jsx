import React, { useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import{useParams} from "react-router-dom"

import{
    FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaExpand, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark,
} from "react-icons/fa";


function PlayVideo() {
    const videoRef = useRef(null)
    const {videoId} = useParams()
    const [video,setVideo]= useState(null)
    const [channel,setChannel]=useState("")
    const [isPlaying,setIsPlaying] = useState(false)
    const [showControls,setShowControls] = useState(false)
    const [progress,setProgress] = useState(0)
    const [currentTime,setCurrentTime] = useState(0)
    const [duration,setDuration] = useState(0)
    const {allVideosData} = useSelector(state => state.content)

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
            <div></div>
            </div>

            </div>

            </div>
        </div>
      
    </div>
  )
}

export default PlayVideo
