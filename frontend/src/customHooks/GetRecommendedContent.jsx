import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setRecommendedContent } from "../redux/userSlice";

const GetRecommendedContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendedContent = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/recommended-content`,
          {
            withCredentials: true,
          }
        );

        dispatch(
          setRecommendedContent({
            videos: result.data.videos || [],
            shorts: result.data.shorts || [],
          })
        );

        console.log("Recommended:", result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecommendedContent();
  }, [dispatch]);
};

export default GetRecommendedContent;