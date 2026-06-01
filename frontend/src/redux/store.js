import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
import contentSlice from "./contentSlice.js"

const store = configureStore({
    reducer:{
        user:userSlice,
        content:contentSlice
    }
})

export default store