import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({

    name: "user",

    initialState: {
        userData: null,
        channelData: null,
        allChanneldata:null,
        subscribedChannels:null,
        subscribedVideos:null,
        subscribedshorts:null,
        subscribedPlaylist:null,
        subscribedPosts:null,
        videoHistory:null,
        shortHistory:null,
        
    },

    reducers: {

        setUserData: (state, action) => {
            state.userData = action.payload
        },

        setChannelData: (state, action) => {
            state.channelData = action.payload
        },
        setAllChannelData:(state,action)=>{
            state.allChanneldata=action.payload
        },
        subscribedChannels:(state,action)=>{
            state.subscribedChannels=action.payload
        },
          subscribedVideos:(state,action)=>{
            state.subscribedVideos=action.payload
        },
          subscribedshorts:(state,action)=>{
            state.subscribedshorts=action.payload
        },
          subscribedPlaylist:(state,action)=>{
            state.subscribedPlaylist=action.payload
        },
          subscribedPosts:(state,action)=>{
            state.subscribedPosts=action.payload
        },
           setVideoHistory:(state,action)=>{
            state.videoHistory=action.payload
        },
           setShortHistory:(state,action)=>{
            state.shortHistory=action.payload
        }

    }

})

export const {
    setUserData,
    setChannelData,
    setAllChannelData,
    setSubscribedChannels,
     setSubscribedVideo,
     setSubscribedVideo,
     setSubscribedShorts,
     setSubscribedPlaylist,
     setSubscribedPosts,
     setVideoHistory,
     setShortHistory

} = userSlice.actions

export default userSlice.reducer