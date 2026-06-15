import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function UpdateShort() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const updateShortHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${serverUrl}/short/update-short/${id}`,
        { title },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        alert("Short Updated Successfully");
        navigate("/ptstudio/content");
      }
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Error updating short"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f]">
      <form
        onSubmit={updateShortHandler}
        className="bg-[#181818] p-6 rounded-lg w-[450px]"
      >
        <h1 className="text-white text-2xl font-bold mb-6">
          Update Short
        </h1>

        <input
          type="text"
          placeholder="Short Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-[#2a2a2a] text-white mb-4 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded"
        >
          {loading ? "Updating..." : "Update Short"}
        </button>
      </form>
    </div>
  );
}

export default UpdateShort;