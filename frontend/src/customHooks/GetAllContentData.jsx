import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { serverUrl } from "../App";
import { setAllVideosData, setAllShortsData } from "../redux/contentSlice";

function GetAllContentData() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const videoRes = await axios.get(`${serverUrl}/api/content/getallvideos`, { withCredentials: true });
        const data = videoRes.data;
        const videos = Array.isArray(data) ? data : data?.videos || data?.data || [];
        dispatch(setAllVideosData(videos));
      } catch (error) {
        dispatch(setAllVideosData([]));
      }
      try {
        const shortsRes = await axios.get(`${serverUrl}/api/content/getallshorts`, { withCredentials: true });
        const data = shortsRes.data;
        const shorts = Array.isArray(data) ? data : data?.shorts || data?.data || [];
        dispatch(setAllShortsData(shorts));
      } catch (error) {
        dispatch(setAllShortsData([]));
      }
    };
    fetchContent();
  }, [dispatch, location.pathname]);

  return null;
}

export default GetAllContentData;
