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
                    serverUrl + "/api/user/getuser",
                    { withCredentials: true }
                )

                dispatch(setUserData(result.data))

                console.log(result.data)

            } catch (error) {

                dispatch(setUserData(null))

                console.log(error)
            }
        }

        fetchUser()

    }, [])

    return null
}

export default GetCurrentUser