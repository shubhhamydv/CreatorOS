import React from 'react'

const ShortCard = ({shortUrl,title,channelName,avatar,views,id}) => {
  return (
    <div className='w-45 sm:w-49 cursor-pointer relative'>
      <div className='roundded-x1 overflow-hidden bg-black w-full h-70 border-1 border-gray-700]'>
        <video src={shortUrl} className='w-full h-full object-cover ' muted playsInline onContextMenu={(e)=>e.preventDefault()} preload='metadata'/>
      </div>
      <div className='mt-2 space-y-2 w-full absolute bottom-0 p-3 bg-[#000000b6] rounded-x1'>
        <h3 className='text-sm font-semibold text-white line-clamp-2'>{title}</h3>
        <div className='flex items-center justify-start gap-1'>
          <img src={avatar} alt="" className='w-4 h-4 object-cover rounded-full' />
        </div>
        <p className='text-xm text-gray-400'>{channelName}</p>
        

      </div>
      <p className='text-xm text-gray-400'>{views || 0} views</p>
    </div>
  )
}

export default ShortCard
