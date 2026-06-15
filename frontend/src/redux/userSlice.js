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
        
        recommendedContent:null
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
        setSubscribedChannels:(state,action)=>{
            state.subscribedChannels=action.payload
        },
        setSubscribedVideos:(state,action)=>{
            state.subscribedVideos=action.payload
        },
        setSubscribedShorts:(state,action)=>{
            state.subscribedshorts=action.payload
        },
        setSubscribedPlaylist:(state,action)=>{
            state.subscribedPlaylist=action.payload
        },
        setSubscribedPosts:(state,action)=>{
            state.subscribedPosts=action.payload
        },
        setVideoHistory:(state,action)=>{
            state.videoHistory=action.payload
        },
        setShortHistory:(state,action)=>{
            state.shortHistory=action.payload
        },
        setRecommendedContent:(state,action)=>{
            state.recommendedContent = action.payload
        }

    }

})

export const {
    setUserData,
    setChannelData,
    setAllChannelData,
    setSubscribedChannels,
    setSubscribedVideos,
    setSubscribedShorts,
    setSubscribedPlaylist,
    setSubscribedPosts,
    setVideoHistory,
    setShortHistory,
    setRecommendedContent

} = userSlice.actions

export default userSlice.reducer