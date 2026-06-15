import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";

function UpdatePlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/playlist/${id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setTitle(data.playlist.title);
        setDescription(data.playlist.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePlaylistHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${serverUrl}/playlist/update/${id}`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        alert("Playlist Updated Successfully");
        navigate("/playlists");
      }
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to update playlist"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <form
        onSubmit={updatePlaylistHandler}
        className="bg-[#181818] p-6 rounded-lg w-[500px]"
      >
        <h1 className="text-white text-2xl font-bold mb-6">
          Update Playlist
        </h1>

        <input
          type="text"
          placeholder="Playlist Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-[#2a2a2a] text-white mb-4 outline-none"
          required
        />

        <textarea
          placeholder="Playlist Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          className="w-full p-3 rounded bg-[#2a2a2a] text-white mb-4 outline-none resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
        >
          {loading ? "Updating..." : "Update Playlist"}
        </button>
      </form>
    </div>
  );
}

export default UpdatePlaylist;