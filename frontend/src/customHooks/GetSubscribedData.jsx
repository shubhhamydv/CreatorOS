import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setSubscribedChannels, setSubscribedPlaylist, setSubscribedPosts, setSubscribedShorts, setSubscribedVideo, setUserData } from '../redux/userSlice'

function GetSubscribedData() {
 const dispatch = useDispatch()
 useEffect(()=>{
    const fetchsubscribedData = async () =>{
        try {
          const result = await axios.get(serverUrl + "/api/user/subscribed-data", {withCredentials:true})
          console.log(result.data)  
          dispatch(setSubscribedChannels(result.data.setSubscribedChannels))
          dispatch(setSubscribedVideo(result.data.setSubscribedVideo))
          dispatch(setSubscribedShorts(result.data.setSubscribedShorts))
          dispatch(setSubscribedPlaylist(result.data.setSubscribedPlaylist))
          dispatch(setSubscribedPosts(result.data.setSubscribedPosts))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }
    fetchsubscribedData
 },[])

}
export default GetSubscribedData