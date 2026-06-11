import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiLogOut } from 'react-icons/fi'
import { MdOutlineSwitchAccount } from "react-icons/md"
import { FcGoogle } from "react-icons/fc"
import { TiUserAddOutline } from "react-icons/ti"
import { SiYoutubestudio } from "react-icons/si"
import {
  FaHistory,
  FaList,
  FaThumbsUp,
} from "react-icons/fa"

import { GoVideo } from "react-icons/go"
import { useNavigate } from 'react-router-dom'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { showCustomAlert } from './CustomAlert'
import { signInWithPopup } from 'firebase/auth' 
import {auth,provider} from '../../utils/firebase' 


function MobileProfile() {

  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
     const dispatch = useDispatch()
   
    const handleSignout = async () => {
         try{
            const result = await axios.get(serverUrl + "/api/auth/signout",{withCredentials:true})
            dispatch(setUserData(null))
            localStorage.removeItem('userData')
            console.log(result.data)
            showCustomAlert("Signout Successfully")
         } catch(error){
         console.log(error)
         showCustomAlert("Signout error")
         }
    }

    const handleGoogleAuth = async ()=>{
        try{
            const response = await signInWithPopup(auth, provider)
            const user = response.user
            const photo = user.photoURL || user.providerData?.[0]?.photoURL || ""
            const name = user.displayName || user.providerData?.[0]?.displayName || ""
            const googleUser = {
                email: user.email,
                userName: name,
                photoUrl: photo,
                photoURL: photo
            }
            console.log("Google user data:", googleUser)
            const result = await axios.post(serverUrl + "/api/auth/googleauth", googleUser, { withCredentials: true })
            const backendUser = result.data
            const mergedUser = {
                ...backendUser,
                photoUrl: backendUser.photoUrl || backendUser.photoURL || googleUser.photoUrl,
                photoURL: backendUser.photoURL || backendUser.photoUrl || googleUser.photoURL
            }
            dispatch(setUserData(mergedUser))
            localStorage.setItem('userData', JSON.stringify(mergedUser))
            showCustomAlert("Google Authentication successful")
        } catch(error){
         console.log(error)
         showCustomAlert("Google sign-in failed")
        }
    }

  return (
    <div className='bg-[#0f0f0f] text-white h-full w-full flex flex-col pt-[100px] p-[10px] mid-hidden block'>

      {/* top profile section */}
      {userData && (
        <div className='p-4 flex items-center gap-4 border-b border-gray-800'>

          {userData?.photoUrl && (
            <img
              src={userData.photoUrl}
              alt="profile"
              className='w-16 h-16 rounded-full object-cover'
            />
          )}

          <div className='flex flex-col'>
            <span className='font-semibold text-lg'>
              {userData?.userName}
            </span>

            <span className='text-gray-400 text-sm'>
              {userData?.email}
            </span>


          <p className='text-sm text-blue-400 cursor-pointer hover:underline ' onClick={()=>{userData?.channel ? navigate("/viewchannel") : navigate('createchannel')}}></p>
          </div>

        </div>
      )}

      {/* auth buttons */}
      <div className='flex gap-2 p-4 border-b border-gray-800 overflow-auto'>

        <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2' onClick={handleGoogleAuth}>
          <FcGoogle className='text-xl' />
          Signin with Google
        </button>

        <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2' onClick={()=>navigate('/signup')}>
          <TiUserAddOutline className='text-xl' />
          Create Account
        </button>

        <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'onClick={()=>navigate("/signin")}>
          <MdOutlineSwitchAccount className='text-xl' />
          Signin
        </button>
{/* 
        <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'>
          <SiYoutubestudio className='text-xl text-orange-400' />
          PT Studio
        </button> */}

        <button className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'onClick={handleSignout}>
          <FiLogOut className='text-xl' />
          Signout
        </button>

      </div>

      {/* menu items */}
      <div className='flex flex-col mt-[20px]'>

        <ProfileMenuItem icon={<FaHistory />} text={"History"} />

        <ProfileMenuItem icon={<FaList />} text={"Playlist"} onClick={()=>navigate("/savedplaylist")}/>

        <ProfileMenuItem icon={<GoVideo />} text={"Saved Videos"} onClick={()=>navigate("/savedcontent")} />

        <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"} onClick={navigate("/likedcontent")}/>

        <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />

      </div>

    </div>
  )
}

function ProfileMenuItem({ icon, text, onClick }) {

  return (
    <button
      onClick={onClick}
      className='flex items-center gap-3 p-4 hover:bg-[#272727] text-left'
    >
      <span className='text-lg'>{icon}</span>
      <span className='text-sm'>{text}</span>
    </button>
  )
}

export default MobileProfile