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
      <div className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4'>
        <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin' />
        <p className='text-gray-400 text-lg'>Loading playlists...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0f0f0f] text-white'>

      {/* Page Header */}
      <div className='px-6 pt-6 pb-4 border-b border-gray-800 flex items-center gap-3'>
        <div className='w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center'>
          <FaList className='text-orange-400 text-sm' />
        </div>
        <div>
          <h1 className='text-xl font-bold'>Saved Playlists</h1>
          <p className='text-xs text-gray-500'>
            {savedPlaylists.length} playlist{savedPlaylists.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className='px-6 py-6 max-w-[1600px] mx-auto'>

        {!savedPlaylists || savedPlaylists.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-[60vh] gap-4 text-gray-400'>
            <FaList className='text-6xl text-gray-600' />
            <p className='text-xl font-semibold'>No Saved Playlists</p>
            <p className='text-sm text-gray-500'>Playlists you save will appear here.</p>
          </div>
        ) : (
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
        )}

      </div>
    </div>
  )
}

export default SavedPlaylist