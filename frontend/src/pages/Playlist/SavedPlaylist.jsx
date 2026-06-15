import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../../App'
import { FaList } from 'react-icons/fa'
import PlaylistCard from '../../component/PlaylistCard'

function SavedPlaylist() {
  const [savedPlaylists, setSavedPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedPlaylist = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/content/savedplaylist", { withCredentials: true })
        // Backend returns { playlists: [...] }
        setSavedPlaylists(result.data?.playlists || result.data || [])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSavedPlaylist()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[70vh] bg-[#0f0f0f] text-gray-400 text-xl'>
        Loading...
      </div>
    )
  }

  if (!savedPlaylists || savedPlaylists.length === 0) {
    return (
      <div className='flex justify-center items-center h-[70vh] bg-[#0f0f0f] text-gray-400 text-xl'>
        No Saved Playlist Found
      </div>
    )
  }

  return (
    <div className='p-6 min-h-screen bg-[#0f0f0f] text-white mt-[40px] lg:mt-[20px]'>
      <h2 className='text-2xl font-bold mb-6 pt-[50px] border-b border-gray-700 flex items-center gap-2'>
        <FaList className='w-7 h-7 text-orange-600' /> Saved Playlists
      </h2>
      <div className='flex flex-wrap gap-6'>
        {savedPlaylists.map((p) => (
          <PlaylistCard
            key={p._id}
            id={p._id}
            title={p.title}
            videos={p.videos || []}
            savedBy={p.savedBy || []}
          />
        ))}
      </div>
    </div>
  )
}

export default SavedPlaylist