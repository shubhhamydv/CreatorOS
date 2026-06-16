import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setShortHistory, setVideoHistory } from '../redux/userSlice'

const GetHistory = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/gethistory",
          { withCredentials: true }
        )
        // Guard: API must return an array; if not, default to empty array
        const history = Array.isArray(result.data) ? result.data : []

        const Videos = history.filter((v) => v.contentType === "Video")
        const Shorts = history.filter((v) => v.contentType === "Short")

        dispatch(setVideoHistory(Videos))
        dispatch(setShortHistory(Shorts))
      } catch (error) {
        console.log(error)
        // Dispatch empty arrays (not null) to prevent future .filter() crashes
        dispatch(setVideoHistory([]))
        dispatch(setShortHistory([]))
      }
    }
    fetchHistory()
  }, [])
}

export default GetHistory