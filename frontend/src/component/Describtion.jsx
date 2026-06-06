import React, { useState } from 'react'

function Describtion() {
    const [expanded,setExpanded] = useState(false)

    const showButton = Text.length >100
  return (
    <div className={`relative ${expanded ? "h-48" : "h-12"} overflow-y-auto px-2 py-1`}>
    <p className={`text-sm text-gray-300 whitespace-pre-line ${expanded ? " " : "line-clamp-1"}`}>{text}</p>
    {showButton && <button className='text-xm text-blue-400 mt-1 hover:underline'>
        {expanded ? "show less" : "show more"}
        
        </button>}
    </div>
  )
}

export default Describtion