import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlay, FaPause, FaComment } from "react-icons/fa";
import Describtion from "../../component/Describtion";

function Shorts() {
  const { allShortData } = useSelector((state) => state.content);

  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);

  const shortRefs = useRef([]);
  const {userData} = useSelector(state=>state.userData)
  const [openComment, setOpenComment] = useState(false)

  useEffect(() => {
    if (!allShortData || allShortData.length === 0) return;

    const shuffled = [...allShortData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
  }, [allShortData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRefs.current[index];

          if (!video) return;

          if (entry.isIntersecting) {
            video.muted = false;
            video.play().catch(() => {});
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.7 }
    );

    shortRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [shortList]);

  const togglePlay = (index) => {
    const video = shortRefs.current[index];

    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayIndex(null);
    } else {
      video.pause();
      setPlayIndex(index);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div
          key={short?._id}
          className="min-h-screen flex justify-center items-center snap-start"
        >
          <div
            className="relative w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden"
            onClick={() => togglePlay(index)}
          >
            <video
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
              src={short?.shortUrl}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />

            {playIndex === index ? (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full">
                <FaPlay className="text-white" />
              </div>
            ) : (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full">
                <FaPause className="text-white" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={short?.channel?.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />

                <span>
                  @{short?.channel?.name?.toLowerCase()}
                </span>

                <button className="bg-white text-black px-4 py-1 rounded-full text-sm">
                  Subscribe
                </button>
              </div>

              <h3 className="font-bold">{short?.title}</h3>

              <div className="flex gap-2 flex-wrap mt-2">
                {short?.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Describtion text={short?.description} />
            </div>
             <div className='absolute right-3 bottom-28 flex items-center gap-6 mt-3 text-white'><IconButton icon={FaThumbsUp} label={"Likes"} active={short?.likes.include(userData._id)} count={short?.likes?.length}/>
                            <IconButton icon={FaThumbsUp} label={"Dislikes"} active={short?.likes.include(userData._id)} count={short?.dislikes?.length}/>
                            <IconButton icon={FaDownload} label={"Download"} onClick={()=>{
                                const link  = document.createElement("a"); link.href = short?.shortUrl;
                                link.download =`${short?.title}.mp4`; link.click();
                            }} />
                            <IconButton icon={FaComment} label={"Comment"}  onClick={()=>setOpenComment()}/>
                            <IconButton icon={FaBookmark} label={"Save"} active={short?.saveBy.include(userData._id)}  />
                           
                            </div>

           
          </div>
           {
openComment && <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
     <div className="flex justify-between items-center mb-3">
      <h3 className="font-bold text-lg"> Comments</h3>
      <button><FaArrowDown size={20} onClick={()=>setOpenComment(!openComment)}/></button>
     </div>
</div>
            }
        </div>
      ))}
    </div>
  );
}

export default Shorts;