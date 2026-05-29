import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({

    name: "user",

    initialState: {
        userData: null,
        channelData: null
    },

    reducers: {

        setUserData: (state, action) => {
            state.userData = action.payload
        },

        setChannelData: (state, action) => {
            state.channelData = action.payload
        }

    }

})

export const {
    setUserData,
    setChannelData
} = userSlice.actions

export default userSlice.reducer