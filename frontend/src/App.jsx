import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgetPassword from './pages/ForgetPassword'

import Shorts from './pages/Shorts/Shorts'
import CreatePage from './pages/Shorts/CreatePage'
import CreateShort from './pages/Shorts/CreateShort'

import CreateVideo from './pages/Videos/CreateVideo'
import PlayVideo from './pages/Videos/PlayVideo'

import CreateChannel from './pages/Channel/CreateChannel'
import ViewChannel from './pages/Channel/ViewChannel'
import UpdateChannel from './pages/Channel/UpdateChannel'
import ChannelPage from './pages/Channel/ChannelPage'

import CreatePlaylist from './pages/Playlist/CreatePlaylist'
import SavedPlaylist from './pages/Playlist/SavedPlaylist'

import CreatePost from './pages/Post/CreatePost'

import LikedContent from './pages/LikedContent'
import MobileProfile from './component/MobileProfile'

import CustomAlert, { showCustomAlert } from './component/CustomAlert'

import GetCurrentUser from './customHooks/getCurrentUser'
import GetChannelData from './customHooks/GetChannelData'
import GetAllContentData from './customHooks/GetAllContentData'
import GetSubscribedData from './customHooks/GetSubscribedData'
import GetHistory from './customHooks/GetHistory'

export const serverUrl = "http://localhost:8000"

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
      <CustomAlert />

      <GetCurrentUser />
      <GetChannelData />
      <GetAllContentData />
      <GetSubscribedData />
      <GetHistory />

      <Routes>

        <Route path="/" element={<Home />}>

          <Route
            path="shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />

          <Route
            path="mobilepro"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />

          <Route
            path="viewchannel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />

          <Route
            path="updatechannel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />

          <Route
            path="create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />

          <Route
            path="createvideo"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />

          <Route
            path="createshort"
            element={
              <ProtectRoute userData={userData}>
                <CreateShort />
              </ProtectRoute>
            }
          />

          <Route
            path="createplaylist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />

          <Route
            path="createpost"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />

          <Route
            path="channelpage/:channelId"
            element={
              <ProtectRoute userData={userData}>
                <ChannelPage />
              </ProtectRoute>
            }
          />

        </Route>

        <Route
          path="/likedcontent"
          element={
            <ProtectRoute userData={userData}>
              <LikedContent />
            </ProtectRoute>
          }
        />

        <Route
          path="/savedplaylist"
          element={
            <ProtectRoute userData={userData}>
              <SavedPlaylist />
            </ProtectRoute>
          }
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />

        <Route
          path="/createchannel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />

        <Route
          path="/playvideo/:videoId"
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo />
            </ProtectRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App