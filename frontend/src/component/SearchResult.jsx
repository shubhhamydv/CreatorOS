import React from 'react'
import ChannelCard from './ChannelCard';
import VideoCard from './VideoCard';
import ShortCard from './ShortCard';
import PlaylistCard from './PlaylistCard';

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

 const [durations, setDurations] = useState({});
    
      useEffect(() => {
        if (Array.isArray(SearchResults?.videos) && SearchResults?.videos.length > 0) {
          SearchResults?.videos.forEach((video) => {
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
      }, [SearchResults?.videos]);

function SearchResult({SearchResult}) {
    const isEmpty = 
    (!SearchResults?.videos || SearchResults.length === 0 ) &&
    (!SearchResults?.short || SearchResults.short.length === 0) &&
    (!SearchResults?.channels || SearchResults.channels.length === 0) &&
    (!SearchResults?.playlists || SearchResults.playlists.length === 0);
  return (
    <div className='px-6 py-4 bg-[#00000051] border-1 border-gray-800 mb-[20px]'>
        <h2 className='text-2x1 font-bold mb-4 '>Search Results:</h2>
        {isEmpty ? (<p className='text-gray-400 text-lg'> No result Found</p>) :(
    <>
    {/* channels section */}
    {SearchResults.channels?.length > 0 && (
        <div className='mb-12'>
            <h3 className='text-x1 font-bold mb-4'>Channels </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {SearchResults.channels.map((ch)=>(
                    <ChannelCard
                    key={ch._id}
                    id={ch._id}
                    name={ch.name}
                    avatar={ch.avatar}
                    />
                ))}
            </div>
        </div>
    )}

   {/* { video section} */}
   {SearchResults.videos?.length >0 && (
    <div >
        <h3 className='text-x1 font-bold mb-4'>Videos</h3>
        <div className='flex flex-wrap gap-6 mb-12'>
            {SearchResults.videos.map((video)=>(
                <VideoCard
                key={video._id}
                thumbnail={video.thumbnail}
                duration={duration[Video._id ] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={`${video.views}`}
                time={new Date(video.createAt).toLocaleDateString()}
                id={video._id}
                
                />
            ))}
        </div>
    </div>
   )}

   {/* short section */}

   {SearchResults.short?.length > 0 && (
    <div className='mt-8'>
        <h3 className='text-x1 font-bold mb-4 '>Shorts</h3>
        <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
            {SearchResults.shors.map((short)=>(
                <div key={short._id} className='flex-shrink-0'>

                    <ShortCard
                    shortUrl={short.shortUrl}
                    title={short.title}
                    channelName={short.channel?.name}
                    views={short.views}
                    id={short._id}
                    avatar={short.channel?.avatar}
                    />
                </div>
            ))}
        </div>
    </div>
   )}


   {/* playlist section */}

   {SearchResults.playlists?.length >0 && (
    <div className='mt-8'>
        <h3 className='text-x1 font-bold mb-4'>Playlists</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {SearchResults/playlists.map((p1)=>(
                <PlaylistCard
                key={p1._id}
                id={p1._id}
                title={p1.title}
                videos={p1.videos}
                savedBy={p1.savedBy}
                />
            ))}
        </div>
    </div>
   )}
    </>
        )}
    </div>
  )
}

export default SearchResult