import axios from 'axios'
import React, { useEffect } from 'react'
import { SiXiaohongshu } from 'react-icons/si'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setShortHistory, setUserData, setVideoHistory } from '../redux/userSlice'

const GetHistory = () => {
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchHistory = async ()=>{
        try {
            const result = await axios.get(serverUrl +"/api/user/gethistory",
                {withCredentials:true}
            )
            const history = result.data

            const Videos = history.filter((v)=>v.contentType === "Video")
             const Shorts = history.filter((v)=>v.contentType === "Short")

             dispatch(setVideoHistory(Videos))
             dispatch(setShortHistory(Shorts))
             console.log({Videos,Shorts})

        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
            dispatch(setVideoHistory(null))
            dispatch(setShortHistory(null))
        }
    }
    fetchHistory()
  },[ ])
}

export default GetHistory