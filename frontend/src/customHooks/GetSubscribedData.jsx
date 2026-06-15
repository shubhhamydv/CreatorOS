import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setSubscribedChannels, setSubscribedPlaylist, setSubscribedPosts, setSubscribedShorts, setSubscribedVideos, setUserData } from '../redux/userSlice'

function GetSubscribedData() {
 const dispatch = useDispatch()
 useEffect(()=>{
    const fetchsubscribedData = async () =>{
        try {
          const result = await axios.get(serverUrl + "/api/user/subscribed-data", {withCredentials:true})
          console.log(result.data)
          dispatch(setSubscribedChannels(result.data.subscribedChannels))
          dispatch(setSubscribedVideos(result.data.subscribedVideos))
          dispatch(setSubscribedShorts(result.data.subscribedShorts))
          dispatch(setSubscribedPlaylist(result.data.subscribedPlaylist))
          dispatch(setSubscribedPosts(result.data.subscribedPosts))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }
    fetchsubscribedData()
 },[])

 return null
}
export default GetSubscribedData