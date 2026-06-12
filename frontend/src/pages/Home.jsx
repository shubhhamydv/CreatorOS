import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import logo from "../assets/CreatorOS.png"

import AllVideosPage from '../component/AllVideosPage'  
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa"

import { SiYoutubeshorts } from "react-icons/si"
import { MdOutlineSubscriptions } from "react-icons/md"
import { GoVideo } from "react-icons/go"
import { IoIosAddCircle } from "react-icons/io"

import Profile from '../component/profile'
import AllShortsPage from '../component/AllShortsPage'

function Home() {

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState("Home")
  const [active, setActive] = useState("Home")
  const [popup, setPopup] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const userData = useSelector((state) => state.user.userData)
  ocnst [popup,setPopup]= useState(false)
  const [searchPopup,setSearchPopup]= useState(false)
  const categories = [
    "All",
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs"
  ]

  return (


    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

    {searchPopup && (
      <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn'>
        <div className='bg-[#1f1f1f] backdrop-blur-md rounded-2x1 shadow-2x1 w-[90%] max-w-md min-h-[400px] sm-min-h-[480px] p-8 felx flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300'>
          <button className='absolute top-4 right-4 text-gray-400 hover:text-white transition'onClick={()=>setSearchPopup(false)}><FaTimes size={22}/></button>
        </div>
      </div>
    )}

      {/* Navbar */}
      <header className='bg-[#0f0f0f] h-[60px] px-4 border-b border-gray-800 fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between'>

        {/* Left */}
        <div className='flex items-center gap-4'>

          <button
            className='text-xl bg-[#272727] p-2 rounded-full'
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>

          <div className='flex items-center gap-2'>
            <img
              src={logo}
              alt="logo"
              className='w-[35px]'
            />

            <span className='text-white font-bold text-xl tracking-tight'>
              CreatorOS
            </span>
          </div>

        </div>

        {/* Search */}
        <div className='hidden md:flex items-center gap-2 flex-1 max-w-xl mx-10'>

          <div className='flex flex-1'>

            <input
              type="text"
              className='flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700'
              placeholder='Search'
            />

            <button className='bg-[#272727] px-4 rounded-r-full border border-gray-700'>
              <FaSearch />
            </button>

          </div>

          <button className='bg-[#272727] p-3 rounded-full' onClick={()=>setSearchPopup(true)}>
            <FaMicrophone />
          </button>

        </div>

        {/* Right */}
        <div className='flex items-center gap-3'>

          {userData?.channel && (
            <button
              className='hidden md:flex items-center gap-2 py-2 rounded-full bg-[#272727] px-4 cursor-pointer hover:bg-[#3a3a3a]'
              onClick={() => navigate("/create")}
            >
              <span className='text-lg'>+</span>
              <span>Create</span>
            </button>
          )}

          {
            !(userData?.photoUrl || userData?.photoURL)
              ? (
                <FaUserCircle
                  className='text-3xl hidden md:flex text-gray-400 cursor-pointer'
                  onClick={() => setPopup(prev => !prev)}
                />
              )
              : (
                <img
                  src={userData?.photoUrl || userData?.photoURL}
                  className='w-9 h-9 rounded-full object-cover border border-gray-700 hidden md:flex cursor-pointer'
                  onClick={() => setPopup(prev => !prev)}
                />
              )
          }

          <FaSearch className='text-lg md:hidden flex' />

        </div>

      </header>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "w-60" : "w-20"}
          bg-[#0f0f0f]
          border-r border-gray-800
          transition-all duration-300
          fixed top-[60px] bottom-0
          z-40 hidden md:flex
          flex-col overflow-y-auto
        `}
      >

        {/* Top Nav */}
        <nav className='space-y-1 mt-3 px-2'>

          <SidebarItem
            icon={<FaHome />}
            text={"Home"}
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home")
              navigate("/")
            }}
          />

          <SidebarItem
            icon={<SiYoutubeshorts />}
            text={"Shorts"}
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts")
              navigate("/shorts")
            }}
          />

          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text={"Subscriptions"}
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {setSelectedItem("Subscriptions");navigate("/subscription")}}
          />

          {sidebarOpen && subscribedChannel?.length > 0 && (
  <>
    <hr className="border-gray-800 my-3" />

    <p className="text-sm text-gray-400 px-4 mb-2">
      Subscriptions
    </p>

    <div className="space-y-1 px-2">
      {subscribedChannel.slice(0, 10).map((ch) => (
        <button
          key={ch._id}
          onClick={() => navigate(`/channelpage/${ch._id}`)}
          className="flex items-center gap-3 justify-start w-full p-2 rounded-lg hover:bg-[#272727] transition"
        >
          <img
            src={ch?.avatar}
            alt={ch?.name}
            className="w-6 h-6 rounded-full object-cover"
          />

          <span className="text-sm text-white truncate">
            {ch?.name}
          </span>
        </button>
      ))}
    </div>
  </>
)}

        </nav>

        <hr className='border-gray-800 my-3' />

        {sidebarOpen && (
          <p className='text-sm text-gray-400 px-4'>
            You
          </p>
        )}

        {/* Bottom Nav */}
        <nav className='space-y-1 mt-3 px-2'>

          <SidebarItem
            icon={<FaHistory />}
            text={"History"}
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {setSelectedItem("History");navigate("/history")}}
          />

          <SidebarItem
            icon={<FaList />}
            text={"Playlists"}
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() =>{ setSelectedItem("Playlists");navigate("savedplaylist")}}
          />

          <SidebarItem
            icon={<GoVideo />}
            text={"Saved Videos"}
            open={sidebarOpen}a
            selected={selectedItem === "Saved Videos"}
            onClick={() =>{ setSelectedItem("Saved Videos");navigate("/savedcontent")}}
          />

          <SidebarItem
            icon={<FaThumbsUp />}
            text={"Liked Videos"}
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {setSelectedItem("Liked Videos");navigate("/likedcontent")}}
          />

        </nav>

      </aside>

      {/* Main Content */}
      <main
        className={`
          pt-[80px]
          px-4
          pb-20
          transition-all duration-300
          ${sidebarOpen ? "md:ml-60" : "md:ml-20"}
        `}
      >

        {/* Categories only on home */}
        {
          location.pathname === "/" && (
            <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide mb-5'>

              {
                categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className='whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700'
                  >
                    {cat}
                  </button>
                ))
              }

            </div>
          )
        }

        
      {popup && <Profile />}

{/* Home Page Videos */}
{location.pathname === "/" && <><AllShortsPage /><AllVideosPage /></>}

<div className='mt-2'>
  <Outlet />
</div>



      </main>

      {/* Mobile Bottom Nav */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50'>

        <MobileSizeNav
          icon={<FaHome />}
          text={"Home"}
          active={active === "Home"}
          onClick={() => {
            setActive("Home")
            navigate("/")
          }}
        />

        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text={"Shorts"}
          active={active === "Shorts"}
          onClick={() => {
            setActive("Shorts")
            navigate("/shorts")
          }}
        />

        <MobileSizeNav
          icon={<IoIosAddCircle />}
          active={active === "+"}
          onClick={() => {
            setActive("+")
            navigate("/create")
          }}
        />

        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text={"Subscriptions"}
          active={active === "Subscription"}
          onClick={() => {setActive("Subscription");navigate("/subscription")}}
        />

        <MobileSizeNav
          icon={
            (userData?.photoUrl || userData?.photoURL)
              ? (
                <img
                  src={userData.photoUrl || userData.photoURL}
                  className='w-8 h-8 rounded-full object-cover border border-gray-700'
                />
              )
              : (
                <FaUserCircle />
              )
          }
          text={"You"}
          active={active === "You"}
          onClick={() => {
            setActive("You")
            navigate("/mobilepro")
          }}
        />

      </nav>

    </div>
  )
}

function SidebarItem({
  icon,
  text,
  open,
  selected,
  onClick
}) {

  return (
    <button
      className={`
        flex items-center gap-4 p-3 rounded-xl w-full transition-colors
        ${open ? "justify-start" : "justify-center"}
        hover:bg-[#272727]
        ${selected ? "bg-[#3f3f3f]" : ""}
      `}
      onClick={onClick}
    >

      <span className="text-lg">
        {icon}
      </span>

      {
        open && (
          <span className="text-sm">
            {text}
          </span>
        )
      }

    </button>
  )
}

function MobileSizeNav({
  icon,
  text,
  onClick,
  active
}) {

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300
        ${active ? "text-white" : "text-gray-400"}
        hover:scale-105
      `}
    >

      <span className='text-2xl'>
        {icon}
      </span>

      {
        text && (
          <span className='text-xs'>
            {text}
          </span>
        )
      }

    </button>
  )
}

export default Home