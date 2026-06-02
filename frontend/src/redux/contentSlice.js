import { createSlice } from "@reduxjs/toolkit"

const contentSlice = createSlice({

    name: "content",

    initialState: {
        allVideosData: [],
        allShortsData: []
    },

    reducers: {

        setAllVideosData: (state, action) => {
            state.allVideosData = action.payload
        },

        setAllShortsData: (state, action) => {
            state.allShortsData = action.payload
        }

    }

})

export const {
    setAllVideosData,
    setAllShortsData
} = contentSlice.actions

export default contentSlice.reducer