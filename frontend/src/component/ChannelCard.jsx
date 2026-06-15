import React from 'react'
import { useNavigate } from 'react-router-dom'

function ChannelCard({id,name,avatar}) {
    const navigate = useNavigate()
  return (

    <div className='flex items-center gap-4 p-4 rounded-lg border border-gray-800 hover:bg-gray-200 cursor-pointer]'onClick={()=>navigate`/channelpage/${id}`}>

<img src={avatar} alt="" className='w-16 h-16 rounded-full object-cover' />
<h3 className='text-lg font-bold'>{name}</h3>


    </div>
  )
}

export default ChannelCard