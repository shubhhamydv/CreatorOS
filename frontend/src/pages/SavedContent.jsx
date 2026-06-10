import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { SiYoutubeshorts } from 'react-icons/si'
import ShortCard from '../component/ShortCard'
import { GoVideo } from 'react-icons/go'
import VideoCard from '../component/VideoCard'
import Video from '../../../backend/model/videoModel'
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";

  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src);

    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  video.onerror = () => {
    callback("0:00");
  };

  video.src = url;
};

function SavedContent() {
    const [savedVideo,setSavedVideo] = useState([])
    const [savedShort,setSavedShort] = useState([])

    const [durations, setDurations] = useState({});
    
      useEffect(() => {
        if (Array.isArray(savedVideo) && savedVideo.length > 0) {
          savedVideo.forEach((video) => {
            if (video?.videoUrl && video?._id) {
              getVideoDuration(video.videoUrl, (formattedTime) => {
                setDurations((prev) => ({
                  ...prev,
                  [video._id]: formattedTime,
                }));
              });
            }
          });
        }
      }, [savedData]);


    useEffect(()=>{
        const fetchSavedContent = async()=>{
        
            try {
                const result =await axios.get(serverUrl +"/api/content/savedvideo",{withCredentials:true})
                setShortVideo(result.data)
               console.log(result.data)
                const result1 = await axios.get (serverUrl +"/api/content/savedshort",{withCredentials:true})
                setSavedShort(result1.data)
                console.log(result1.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchSavedContent()
    })
  return (
    <div className='px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]'>
        {savedShort.length && (
            <>
            <h2 className='text-2x1 font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2'>
            <SiYoutubeshorts/>  Saved Shorts </h2>
            
            <div className='flex gap-4 overflow-x-hidden pb-4 scrollbar-hide '>

                {savedShort?.map((short)=>(
                    <div key={short?._id} className='flex-shrink-0'>
                        <ShortCard
                        shortUrl={short?.shortUrl}
                        title={short?.title}
                        channelName={short?.channel?.name}
                        views={short?.views}
                        id={short._id}
                        avatar={short?.channel?.avatar}
                        />
                    </div>
                ))}
            </div>
            </>
        ) }

  {savedVideo.length && (
            <>
            <h2 className='text-2x1 font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2'>
            <GoVideo/>   Liked Video </h2>
            
            <div className='flex gap-4 overflow-x-hidden pb-4 scrollbar-hide '>

                {savedShort?.map((video)=>(
                    <div key={video?._id} className='flex-shrink-0'>
                        <VideoCard
                           key={VideoColorSpace._id}
                           thumbnail={video.thumbnail}
                           duration={duration[video._id] || "0:00"}
                           channelLogo={video.channel?.avatar}
                           title={video.title}
                           channelName={video.channel?.name}
                           views={video.views}
                           id={video._id}
                        />
                    </div>
                ))}
            </div>
            </>
         ) }

    </div>
  )
}

export default SavedContent