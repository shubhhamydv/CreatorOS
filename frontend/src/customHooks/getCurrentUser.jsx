import React, { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function GetCurrentUser() {

  const dispatch = useDispatch()

  useEffect(() => {

    const fetchUser = async () => {
      try {

        const result = await axios.get(
          `${serverUrl}/api/user/getuser`,
          { withCredentials: true }
        )

        const serverUser = result.data.user

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

        console.log("USER DATA:", mergedUser)

      } catch (error) {

        const savedUser = JSON.parse(
          localStorage.getItem('userData') || 'null'
        )

        if (savedUser) {
          dispatch(setUserData(savedUser))
        }

        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    fetchUser()

  }, [dispatch])

  return null
}

export default GetCurrentUser