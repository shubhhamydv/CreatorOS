import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../App"
import { setChannelData, setAllChannelData } from "../redux/userSlice"

const GetChannelData = () => {
  const dispatch = useDispatch()

  // Get logged-in user's own channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/getchannel`, { withCredentials: true })
        dispatch(setChannelData(result.data?.channel || null))
      } catch (error) {
        console.log("GET CHANNEL ERROR:", error?.response?.data?.message || error.message)
        dispatch(setChannelData(null))
      }
    }
    fetchChannel()
  }, [dispatch])

  // Get ALL channels (for ChannelPage lookups + subscriptions)
  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/allchannel`, { withCredentials: true })
        // Bug fixed: was dispatching null on error which breaks ChannelPage
        dispatch(setAllChannelData(result.data?.channels || []))
      } catch (error) {
        console.log("GET ALL CHANNELS ERROR:", error?.response?.data?.message || error.message)
        dispatch(setAllChannelData([]))
      }
    }
    fetchAllChannels()
  }, [dispatch])

  return null
}

export default GetChannelData