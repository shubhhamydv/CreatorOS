import React, { useState } from 'react'
import { FaVideo, FaPlay, FaList, FaPen } from 'react-icons/fa'
import  create from "../../assets/create.png"

function CreatePage() {

  const [selected, setSelected] = useState("")

  const option = [
    {
      id: "video",
      icon: <FaVideo size={28} />,
      title: "Upload Video"
    },

    {
      id: "short",
      icon: <FaPlay size={28} />,
      title: "Create Short"
    },

    {
      id: "post",
      icon: <FaPen size={28} />,
      title: "Create Community Post"
    },

    {
      id: "playlist",
      icon: <FaList size={28} />,
      title: "New Playlist"
    },
  ]

  return (

    <div className='bg-[#0f0f0f] min-h-screen text-white px-6 py-8 flex flex-col'>

      {/* Header */}
      <header className='mb-12 border-b border-[#3f3f3f] pb-4'>

        <h1 className='text-4xl font-bold tracking-tight'>
          Create Content
        </h1>

        <p className='text-gray-400 mt-1 text-sm'>
          Choose what type of content you want to create for your audience
        </p>

      </header>

      {/* Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1'>

        {
          option.map((opt) => (

            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-6 flex flex-col items-center text-center justify-center cursor-pointer transition ${
                selected === opt.id
                  ? "ring-2 ring-red-500"
                  : "hover:bg-[#272727]"
              }`}
            >

              <div className='bg-[#272727] p-4 rounded-full mb-4'>
                {opt.icon}
              </div>

              <h2 className='text-lg font-semibold'>
                {opt.title}
              </h2>

            </div>

          ))
        }
        

      
         

      </div>
      <div className='flex flex-col items-center mt-16'>
         <img src={create} alt="" className='w-20' />
         {
            !selected? (
                <div>
                    <p className='mt-4  text-center font-medium'> Create content on any device</p>
                    <p className='text-gray-400 text-sm text-center'>upload and record home or on the go. Everything you make public will appear here.</p>
                </div>
            ) :(
                  <div className='felx flex-col items-center justify-center gap-1'>
                      <p className='mt-4  text-center font-medium'> Ready to create</p>
                    <p className='text-gray-400 text-sm text-center'>Click below to start your {IoMdOptions.find((opt)=>opt.id === selected?.title.toLowerCase())}</p>
                    <button className='bg-white text-black mt-4 px-5 py-1 rounded-full font-medium cursor-pointer'></button>
                  </div>
            )

        

         }
      </div>

    </div>
  )
}

export default CreatePage