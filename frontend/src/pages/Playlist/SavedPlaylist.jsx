import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../../App'
import { FaList } from 'react-icons/fa'
import Playlist from '../../../../backend/model/playlistModel'
import PlaylistCard from '../../component/PlaylistCard'

function SavedPlaylist() {
    const [SavedPlaylist,setSavedPlaylist] =useState([])
    useEffect(()=>{
      const fetchSavedPlaylist = async ()=>{
        try {
            const result = await axios.get(serverUrl +"/api/content/savedplaylist",{withCredentials:true})
            setSavedPlaylist(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(result.data)
        }
      }
      fetchSavedPlaylist()
    },[])

    if(!SavedPlaylist || SavedPlaylist.length === 0){
        return(
            <div className='flex justify-center items-center h-[70px] text-gray-400 text-x1 '>No Saved Plalist Found</div>
        )
    }
  return (
    <div className='p-6bmin-h-screen bg-black text-white mt-[40px] lg:mt-[20px]'>
      <h2 className='text-2x1 font-bold mb-6 pt-[50px] border-b border-gray-300 flex items-center gap-2'>
                 <FaList className='w-7 h-7 text-orange-600'/>   Saved  Playlist </h2>
                 <div className='flex flex-wrap gap-6'>
                    {SavedPlaylist?.map((p1)=>(
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
  )
}

export default SavedPlaylist