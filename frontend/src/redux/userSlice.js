import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({

    name: "user",

    initialState: {
        userData: null,
        channelData: null,
        allChanneldata:null
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
        }

    }

})

export const {
    setUserData,
    setChannelData,
    setAllChannelData
} = userSlice.actions

export default userSlice.reducer