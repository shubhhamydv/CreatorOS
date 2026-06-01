import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setAllVideosData } from '../redux/contentSlice'

const GetAllContentData = () => {
  const dispatch = useDispatch()

  useEffect(() => {

    const fetchAllVideos = async () => {
      try {

        const result = await axios.get(
          `${serverUrl}/api/content/getallvideos`,
          { withCredentials: true }
        )
        dispatch(setAllVideosData(result.data))
        console.log(result.data)

       {/* const serverUser = result.data.user

        const savedUser = JSON.parse(
          localStorage.getItem('userData') || 'null'
        )

        const mergedUser = {
          ...serverUser,
          photoUrl:
            serverUser?.photoUrl ||
            serverUser?.photoURL ||
            savedUser?.photoUrl ||
            savedUser?.photoURL,

          photoURL:
            serverUser?.photoURL ||
            serverUser?.photoUrl ||
            savedUser?.photoURL ||
            savedUser?.photoUrl
        }

        dispatch(setUserData(mergedUser))

        localStorage.setItem(
          'userData',
          JSON.stringify(mergedUser)
        )

        console.log("USER DATA:", mergedUser) */}

      } catch (error) {

        console.log(error)
        dispatch(setAllVideosData(null))

       {/* const savedUser = JSON.parse(
          localStorage.getItem('userData') || 'null'
        )

        if (savedUser) {
          dispatch(setUserData(savedUser))
        }

        if (error.response?.status !== 401) {
          console.log(error)
        }
      } */}
    }
}

    fetchAllVideos()

  }, [])

   useEffect(() => {

    const fetchAllVideos = async () => {
      try {

        const result = await axios.get(
          `${serverUrl}/api/content/getallvideos`,
          { withCredentials: true }
        )
        dispatch(setAllVideosData(result.data))
        console.log(result.data)

       {/* const serverUser = result.data.user

        const savedUser = JSON.parse(
          localStorage.getItem('userData') || 'null'
        )

        const mergedUser = {
          ...serverUser,
          photoUrl:
            serverUser?.photoUrl ||
            serverUser?.photoURL ||
            savedUser?.photoUrl ||
            savedUser?.photoURL,

          photoURL:
            serverUser?.photoURL ||
            serverUser?.photoUrl ||
            savedUser?.photoURL ||
            savedUser?.photoUrl
        }

        dispatch(setUserData(mergedUser))

        localStorage.setItem(
          'userData',
          JSON.stringify(mergedUser)
        )

        console.log("USER DATA:", mergedUser) */}

      } catch (error) {

        console.log(error)
        dispatch(setAllVideosData(null))

       {/* const savedUser = JSON.parse(
          localStorage.getItem('userData') || 'null'
        )

        if (savedUser) {
          dispatch(setUserData(savedUser))
        }

        if (error.response?.status !== 401) {
          console.log(error)
        }
      } */}
    }
}

    fetchAllVideos()

  }, [])




}

export default GetAllContentData
