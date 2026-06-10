import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import GetAllContentData from './customHooks/GetAllContentData'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Shorts from './pages/Shorts/Shorts'
import ForgetPassword from './pages/ForgetPassword'

import CreateChannel from './pages/Channel/CreateChannel'
import ViewChannel from './pages/Channel/ViewChannel'
import UpdateChannel from './pages/Channel/UpdateChannel'

import MobileProfile from './component/MobileProfile'
import CustomAlert, { showCustomAlert } from './component/CustomAlert'

import GetCurrentUser from './customHooks/getCurrentUser'
import GetChannelData from './customHooks/GetChannelData'
import CreatePage from './pages/Shorts/CreatePage'
import CreateVideo from './pages/Videos/CreateVideo'
import CreatePlaylist from './pages/Playlist/CreatePlaylist'
import CreatePost from './pages/Post/CreatePost'
import CreateShort from "./pages/Shorts/CreateShort"
import PlayVideo from './pages/Videos/PlayVideo.'
import ChannelPage from './pages/Channel/ChannelPage'
import LikedContent from './pages/LikedContent'

export const serverUrl = "http://localhost:8000"



// Protect Route
const ProtectRoute = ({ userData, children }) => {

  if (!userData) {
    showCustomAlert("Please signup first to use this feature")
    return <Navigate to="/signin" replace />
  }

  return children
}



function App() {

  const { userData } = useSelector((state) => state.user)

  return (
    <>

      {/* Custom Alert */}
      <CustomAlert />

      {/* Current User */}
      <GetCurrentUser />

      {/* Channel Data */}
      <GetChannelData />

      <GetAllContentData />


      <Routes>

        {/* Main Layout */}
        <Route path='/' element={<Home />}>

          {/* Shorts */}
          <Route
            path='shorts'
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />

          {/* Mobile Profile */}
          <Route
            path='mobilepro'
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />

          {/* View Channel */}
          <Route
            path='viewchannel'
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />

          {/* Update Channel */}
          <Route
            path='updatechannel'
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />

          {/* Create Video/Page */}
          <Route
            path='create'
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />

          <Route
            path='createvideo'
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />


         <Route path="createshort" element={<CreateShort />} />
          {/* <Route
            path='createshort'
            element={
              <ProtectRoute userData={userData}>
                <CreateShort />
              </ProtectRoute>
            }
          /> */}

          <Route
            path='createplaylist'
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />

          <Route
            path='createpost'
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />
          
          <Route
            path='channelpage/:channelId'
            element={
              <ProtectRoute userData={userData}>
                <ChannelPage/>
              </ProtectRoute>
            }
          />

        </Route>

        <Route
            path='likedcontent'
            element={
              <ProtectRoute userData={userData}>
                <LikedContent/>
              </ProtectRoute>
            }
          />

          <Route
            path='savedcontent'
            element={
              <ProtectRoute userData={userData}>
                <SavedContent/>
              </ProtectRoute>
            }
          />

       



        {/* Auth Routes */}
        <Route path='/signup' element={<SignUp />} />

        <Route path='/signin' element={<SignIn />} />

        <Route path='/forgetpass' element={<ForgetPassword />} />



        {/* Create Channel */}
        <Route
          path='/createchannel'
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
         {/*playvideo*/}
        <Route
          path='/playvideo/:videoId'
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo/>
            </ProtectRoute>
          }
        />

      </Routes>

    </>
  )
}

export default App