import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { serverUrl } from "../App"
import { setChannelData } from "../redux/userSlice"

const GetChannelData = () => {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchChannel = async () => {

            try {

                const result = await axios.get(
                    `${serverUrl}/api/user/getchannel`,
                    {
                        withCredentials: true
                    }
                )

                console.log("CHANNEL DATA:", result.data)

                // IMPORTANT FIX
                dispatch(setChannelData(result.data.channel))

            } catch (error) {

                console.log(error)
                console.log(error.response)
                console.log(error.message)

                dispatch(setChannelData(null))
            }
        }

        fetchChannel()

    }, [dispatch])

    return null
}

export default GetChannelData