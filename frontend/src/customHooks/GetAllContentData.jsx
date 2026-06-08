import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setAllVideosData, setAllShortsData } from "../redux/contentSlice";

function GetAllContentData() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const videoRes = await axios.get(`${serverUrl}/api/content/getallvideos`);
        const data = videoRes.data;
        const videos = Array.isArray(data) ? data : data?.videos || data?.data || [];
        dispatch(setAllVideosData(videos));
      } catch (error) {
        dispatch(setAllVideosData([]));
      }

      try {
        const shortsRes = await axios.get(`${serverUrl}/api/content/getallshorts`);
        const data = shortsRes.data;
        const shorts = Array.isArray(data) ? data : data?.shorts || data?.data || [];
        dispatch(setAllShortsData(shorts));
      } catch (error) {
        dispatch(setAllShortsData([]));
      }
    };

    fetchContent();
  }, [dispatch]);

  return null;
}

export default GetAllContentData;
