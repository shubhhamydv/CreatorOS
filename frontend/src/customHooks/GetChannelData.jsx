import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import {
  setChannelData,
  setAllChannelData,
} from "../redux/userSlice";

const GetChannelData = () => {
  const dispatch = useDispatch();

  // Get Logged-in User Channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        console.log("GET CHANNEL DATA RUNNING");

        const result = await axios.get(
          `${serverUrl}/api/user/getchannel`,
          {
            withCredentials: true,
          }
        );

        console.log("CHANNEL DATA:", result.data);

        dispatch(setChannelData(result.data.channel));
      } catch (error) {
        console.log("GET CHANNEL ERROR:", error);
        dispatch(setChannelData(null));
      }
    };

    fetchChannel();
  }, [dispatch]);

  // Get All Channels
  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        console.log("GET ALL CHANNELS RUNNING");

        const result = await axios.get(
          `${serverUrl}/api/user/allgetchannel`,
          {
            withCredentials: true,
          }
        );

        console.log("ALL CHANNELS DATA:", result.data);

        dispatch(
          setAllChannelData(
            result.data.channels || result.data.channel || []
          )
        );
      } catch (error) {
        console.log("GET ALL CHANNELS ERROR:", error);
        dispatch(setAllChannelData(null));
      }
    };

    fetchAllChannels();
  }, [dispatch]);

  return null;
};

export default GetChannelData;