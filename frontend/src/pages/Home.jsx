import React, { useState } from 'react'


import logo from "../assets/CreatorOS.png";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";            
import { MdOutlineSubscriptions } from "react-icons/md"; 
import {GoVideo} from "react-icons/go";
import {IoIosAddCircle} from "react-icons/io";
//import { Outlet, useNavigate } from 'react-router-dom';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Profile from '../component/profile';



function Home() {

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState("Home")
  const [active, setActive] = useState("Home")
  const navigate = useNavigate()
  const location = useLocation()
  const userData = useSelector((state) => state.user.userData)
  const [popup,setPopup] = useState(false)

  const categories = [
  "All", "Music", "Gaming", "Movies", "TV Shows", "News", "Trending",
  "Entertainment", "Education", "Science & Tech", "Travel", "Fashion",
  "Cooking", "Sports", "Pets", "Art", "Comedy", "Vlogs"
];


  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

      {/* navbar */}
      <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50 hidden md:flex'>

        <div className='flex items-center justify-between'>

          {/* left */}
          <div className='flex items-center gap-4'>

            <button
              className='text-xl bg-[#272727] p-2 rounded-full'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>

            <div className='flex items-center gap-[5px]'>
              <img src={logo} alt="logo" className='w-[30px]' />

              <span className='text-white font-bold text-xl tracking-tight font-roboto'>
                CreatorOS
              </span>
            </div>

          </div>

          {/* search */}
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

            <button className='bg-[#272727] p-3 rounded-full'>
              <FaMicrophone />
            </button>

          </div>

          {/* right */}
          <div className='flex items-center gap-3'>

            { userData?.channel &&<button className='hidden md:flex items-center gap-1 py-1 rounded-full bg-[#272727] px-3 cursor-pointer'>
                <span className='text-lg'>+</span>
                <span>Create</span>
              </button>}

          { !(userData?.photoUrl || userData?.photoURL) ? <FaUserCircle className='text-3xl hidden md:flex text-gray-400 '  onClick={()=>setPopup(prev => !prev)}/> : <img src={userData?.photoUrl || userData?.photoURL} className='w-9 h-9 rounded-full object-cover border boader-gray-700 hidden md:flex'  onClick={()=>setPopup(prev => !prev)}/>}

            <FaSearch className='text-lg md:hidden flex' />

          </div>

        </div>

      </header>

      {/* sidebar */}
      {/* sideBar */}

      <aside
        className={`${sidebarOpen ? "w-60" : "w-20"
          } bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40 hidden md:flex flex-col overflow-y-auto`}
      >  
        <nav className='space-y-1 mt-3'>
          <SidebarItem  icon={<FaHome/>} text={"Home"} open={sidebarOpen} selected={selectedItem === "Home"} onClick={()=>{setSelectedItem("Home");navigate("/")}}/> 
          
           < SidebarItem icon={<SiYoutubeshorts/>} text={"Shorts"} open={sidebarOpen} selected={selectedItem === "Shorts"} onClick={()=>{setSelectedItem("Shorts");navigate("/shorts")}}/> 

            <SidebarItem  icon={<MdOutlineSubscriptions/>} text={"Subscriptions"} open={sidebarOpen} selected={selectedItem === "Subscriptions"} onClick={()=>setSelectedItem("Subscriptions")}/> 
        </nav>

        <hr className='border-gray-800 my-3'/>
         {sidebarOpen && <p className='text-sm text-gray-400 px-2'>You</p>}

        <nav className='space-y-1 mt-3'>
        
          <SidebarItem  icon={<FaHistory/>} text={"History"} open={sidebarOpen} selected={selectedItem === "History"} onClick={()=>setSelectedItem("History")}/> 
          
           < SidebarItem icon={<FaList/>} text={"Playlists"} open={sidebarOpen} selected={selectedItem === "Playlists"} onClick={()=>setSelectedItem("Playlists")}/> 

            <SidebarItem  icon={< GoVideo/>} text={"Save Videos"} open={sidebarOpen} selected={selectedItem === "Save Videos"} onClick={()=>setSelectedItem("Save Videos")}/> 

            <SidebarItem  icon={< FaThumbsUp/>} text={"Liked Videos"} open={sidebarOpen} selected={selectedItem === "Liked Videos"} onClick={()=>setSelectedItem("Liked Videos")}/>
        </nav>

         <hr className='border-gray-800 my-3'/>
          {sidebarOpen && <p className='text-sm text-gray-400 px-2'>Subscriptions</p>}

      </aside>

      {/* Main Area*/}
      <main className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all   duratio-300 ${sidebarOpen ? "md:ml-60" : "md:ml-20"}` }>
        {   location.pathname === "/" && (
          <>
         <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2 mt-[60px]'>
          {categories.map((cat,idx)=>(
          <button key={idx} className='whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700'>{cat}

          </button>
          ))}
        </div>
        </>)}

        {popup && <Profile/>}

        <div className='mt-2'> 
          <Outlet/>
        </div>

        
         </main>




     {/*bottom nav for mobile ui*/}

     <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50'>
      <MobileSizeNav icon={<FaHome/>} text={"Home"} active={active === "Home"} onClick={()=>setActive("Home")}/>

      <MobileSizeNav icon={<SiYoutubeshorts/>} text={"Shorts"} active={active === "Shorts"} onClick={()=>setActive("Shorts")}/>

      <MobileSizeNav icon={<IoIosAddCircle />}   active={active === "+"} onClick={()=>setActive(" +")}/>

      <MobileSizeNav icon={<MdOutlineSubscriptions/>} text={"Subscriptions"} active={active === "Subscription"} onClick={()=>setActive("Subscription")}/>

  <MobileSizeNav
  icon={
    (userData?.photoUrl || userData?.photoURL) ? (
      <img
        src={userData.photoUrl || userData.photoURL}
        className='w-8 h-8 rounded-full object-cover border border-gray-700'
      />
    ) : (
      <FaUserCircle />
    )
  }
  text={"You"}
  active={active === "You"}
  onClick={() => {
    setActive("You");
    navigate("/mobilepro");
  }}
/>

     </nav>

    </div>
  )
}

function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${open ? "justify-start" : "justify-center"
        } hover:bg-[#272727] ${selected ? "bg-[#3f3f3f]" : ""
        }`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>

      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

//for mobile ui optimization 
 
function MobileSizeNav({icon, text, onClick, active}){
  return(
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${active ?  "text-white" : "text-gray-400"} hover:scale-105`}>
      <span className=' text-2xl'> {icon} </span>
      {text && <span className=' text-xs' >{text}</span>}

    </button>
  )
}

export default Home