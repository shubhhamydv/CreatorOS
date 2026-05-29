import React from 'react'
import { useSelector } from 'react-redux'
import create from "../../assets/create.png"
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa"

function ViewChannel() {

    const { channelData } = useSelector(state => state.user)

    const navigate = useNavigate()

    return (

        <div className='min-h-screen bg-black text-white w-full'>

            {/* ================= BANNER ================= */}

            <div className='w-full h-40 md:h-56 lg:h-72 overflow-hidden'>

                {
                    channelData?.banner ? (

                        <img
                            src={channelData.banner}
                            alt="banner"
                            className='w-full h-full object-cover'
                        />

                    ) : (

                        <div className='w-full h-full bg-[#272727]'></div>

                    )
                }

            </div>

            {/* ================= CHANNEL HEADER ================= */}

            <div className='px-5 md:px-10'>

                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>

                    {/* LEFT SIDE */}

                    <div className='flex flex-col sm:flex-row sm:items-center gap-5 -mt-12'>

                        {/* AVATAR */}

                        <div className='flex justify-center sm:block'>

                            {
                                channelData?.avatar ? (

                                    <img
                                        src={channelData.avatar}
                                        alt="avatar"
                                        className='w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-black object-cover bg-black'
                                    />

                                ) : (

                                    <div className='w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-800 border-4 border-black flex items-center justify-center'>

                                        <FaUserCircle
                                            size={80}
                                            className='text-gray-500'
                                        />

                                    </div>

                                )
                            }

                        </div>

                        {/* CHANNEL DETAILS */}

                        <div className='text-center sm:text-left mt-3 sm:mt-10'>

                            <h1 className='text-2xl md:text-4xl font-bold'>
                                {channelData?.name || "Channel Name"}
                            </h1>

                            <p className='text-gray-400 mt-1 text-sm'>
                                @{channelData?.name?.toLowerCase()} • {channelData?.owner?.email}
                            </p>

                            <p className='text-gray-400 mt-2 text-sm max-w-xl'>
                                {channelData?.description || "No description"}
                            </p>

                            <p className='text-gray-500 mt-2 text-sm'>
                                Category : {channelData?.category}
                            </p>

                        </div>

                    </div>

                    {/* RIGHT SIDE BUTTONS */}

                    <div className='flex flex-wrap gap-3 mt-6 lg:mt-10 justify-center lg:justify-end'>

                        <button
                            onClick={() => navigate("/updatechannel")}
                            className='bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-300 transition-all'
                        >
                            Customize channel
                        </button>

                        <button
                            className='bg-[#272727] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#3a3a3a] transition-all'
                        >
                            Manage videos
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= TABS ================= */}

            <div className='border-b border-gray-800 mt-8 px-5 md:px-10'>

                <div className='flex gap-8 text-sm md:text-base overflow-x-auto'>

                    <button className='border-b-2 border-white pb-3 font-semibold'>
                        Home
                    </button>

                    <button className='pb-3 text-gray-400 hover:text-white'>
                        Videos
                    </button>

                    <button className='pb-3 text-gray-400 hover:text-white'>
                        Shorts
                    </button>

                    <button className='pb-3 text-gray-400 hover:text-white'>
                        Playlists
                    </button>

                    <button className='pb-3 text-gray-400 hover:text-white'>
                        Community
                    </button>

                </div>

            </div>

            {/* ================= EMPTY SECTION ================= */}

            <div className='flex flex-col items-center justify-center mt-20 px-5'>

                <img
                    src={create}
                    alt="create"
                    className='w-24'
                />

                <h2 className='text-xl font-semibold mt-6'>
                    Create content on any device
                </h2>

                <p className='text-gray-400 text-center mt-3 max-w-md'>
                    Upload and record at home or on the go.
                    Everything you make public will appear here.
                </p>

                <button
                    className='bg-white text-black mt-6 px-6 py-2 rounded-full font-semibold hover:bg-gray-300' onClick={()=>navigate("/create")}
                >
                    + Create
                </button>

            </div>

        </div>
    )
}

export default ViewChannel