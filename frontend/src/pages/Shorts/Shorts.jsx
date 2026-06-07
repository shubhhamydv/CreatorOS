import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlay, FaPause, FaComment, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import Describtion from "../../component/Describtion";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

// FIX: icon→Icon (uppercase) so React renders it as a component
const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button className='flex flex-col items-center gap-1' onClick={onClick}>
    <div className={`${active ? "bg-white" : "bg-[#00000065]"} border border-gray-700 p-2 rounded-full hover:bg-gray-700 transition`}>
      <Icon size={18} className={`${active ? "text-black" : "text-white"}`} />
    </div>
    <span className='text-xs text-white'>{label}{count !== undefined ? `(${count})` : ""}</span>
  </button>
);

function Shorts() {
  const { allShortsData } = useSelector((state) => state.content);  // FIX: allShortData → allShortsData
  const { userData } = useSelector((state) => state.user);          // FIX: state.userData → state.user

  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [loading, setLoading] = useState(false);                    // FIX: loading was used but never declared
  const [openComment, setOpenComment] = useState(null);            // FIX: null so we track which short's comment is open
  const [viewedShort, setViewedShort] = useState([]);
  const [comment, setComment] = useState({});
  const [newComment, setNewComment] = useState("");

  const shortRefs = useRef([]);

  const handleSubscribe = async (channelId) => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/user/togglesubscribe", { channelId }, { withCredentials: true });
      const updatedChannel = result.data;
      setShortList((prev) => prev.map((short) =>
        short?.channel?._id === channelId ? { ...short, channel: updatedChannel } : short
      ));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleAddView = async (shortId) => {
    try {
      // FIX: was using undefined shortId variable
      await axios.put(`${serverUrl}/api/content/short/${shortId}/add-view`, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-like`, {}, { withCredentials: true });
      const updatedShort = result.data;
      // FIX: was comparing short._id === updatedShort (object, not id)
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-dislike`, {}, { withCredentials: true });
      const updatedShort = result.data;
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-save`, {}, { withCredentials: true });
      const updatedShort = result.data;
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (shortId) => {
    if (!newComment) return;
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/add-comment`, { message: newComment }, { withCredentials: true });
      setComment((prev) => ({ ...prev, [shortId]: result.data.comments || [] }));
      setNewComment("");  // FIX: was setNewComments (undefined)
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return;
    const shuffled = [...allShortsData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
  }, [allShortsData]);

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
            const currentShortId = shortList[index]?._id;  // FIX: currentShortUrl → currentShortId
            if (currentShortId && !viewedShort.includes(currentShortId)) {
              handleAddView(currentShortId);
              setViewedShort((prev) => [...prev, currentShortId]);
            }
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.7 }
    );
    shortRefs.current.forEach((video) => { if (video) observer.observe(video); });
    return () => observer.disconnect();
  }, [shortList]);

  const togglePlay = (index) => {
    const video = shortRefs.current[index];
    if (!video) return;
    if (video.paused) { video.play(); setPlayIndex(null); }
    else { video.pause(); setPlayIndex(index); }
  };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div key={short?._id} className="min-h-screen flex justify-center items-center snap-start">
          <div className="relative w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden" onClick={() => togglePlay(index)}>
            <video
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
              src={short?.shortUrl}
              className="w-full h-full object-cover"
              loop muted playsInline
            />

            {playIndex === index ? (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"><FaPlay className="text-white" /></div>
            ) : (
              <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"><FaPause className="text-white" /></div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-2 mb-2">
                <img src={short?.channel?.avatar} alt="" className="w-8 h-8 rounded-full" />
                <span>@{short?.channel?.name?.toLowerCase()}</span>
                <button
                  className={`${short?.channel?.subscribers?.includes(userData?._id) ? "bg-[#000000a1] text-white border border-gray-700" : "bg-white text-black"} text-xs px-4 py-2 rounded-full cursor-pointer`}
                  onClick={(e) => { e.stopPropagation(); handleSubscribe(short?.channel?._id); }}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={15} color="gray" /> : short?.channel?.subscribers?.includes(userData?._id) ? "Subscribed" : "Subscribe"}
                </button>
              </div>
              <h3 className="font-bold">{short?.title}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {short?.tags?.map((tag, i) => (
                  <span key={i} className="bg-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <Describtion text={short?.description} />
            </div>

            {/* FIX: IconButton now uses correct uppercase Icon prop, includes all imports */}
            <div className='absolute right-3 bottom-28 flex flex-col items-center gap-4 text-white' onClick={(e) => e.stopPropagation()}>
              <IconButton icon={FaThumbsUp} label={"Likes"} active={short?.likes?.includes(userData?._id)} count={short?.likes?.length} onClick={() => toggleLike(short._id)} />
              <IconButton icon={FaThumbsDown} label={"Dislikes"} active={short?.dislikes?.includes(userData?._id)} count={short?.dislikes?.length} onClick={() => toggleDislike(short._id)} />
              <IconButton icon={FaDownload} label={"Download"} onClick={() => {
                const link = document.createElement("a");
                link.href = short?.shortUrl;
                link.download = `${short?.title}.mp4`;
                link.click();
              }} />
              <IconButton icon={FaComment} label={"Comment"} onClick={() => setOpenComment(openComment === short._id ? null : short._id)} />
              <IconButton icon={FaBookmark} label={"Save"} active={short?.saveBy?.includes(userData?._id)} onClick={() => toggleSave(short._id)} />
            </div>

            {/* FIX: comment panel - fixed all variable names, input handler, value prop */}
            {openComment === short._id && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto z-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button onClick={() => setOpenComment(null)}><FaArrowDown size={20} /></button>
                </div>
                <div className="mt-4 flex gap-2">
                  {/* FIX: was e.setNewComment (wrong), value was {{newComment}} (object) */}
                  <input type="text" placeholder="Add a comment..." className="flex-1 bg-gray-900 text-white p-2 rounded"
                    onChange={(e) => setNewComment(e.target.value)} value={newComment} />
                  <button className="bg-black px-4 py-2 border border-gray-700 rounded-xl"
                    onClick={() => handleAddComment(short._id)}>Post</button>
                </div>
                <div className="space-y-3 mt-4">
                  {/* FIX: was comments[short._id] (undefined), should be comment[short._id] */}
                  {comment[short._id]?.length > 0
                    ? comment[short._id].map((c, i) => (
                      <div key={i} className="bg-gray-800 p-2 rounded text-sm">{c?.message}</div>
                    ))
                    : <p className="text-sm text-gray-400">No comments yet.</p>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shorts;
