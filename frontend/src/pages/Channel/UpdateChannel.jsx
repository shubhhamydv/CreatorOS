import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setChannelData } from "../../redux/userSlice";

function UpdateChannel() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const serverUrl = "http://localhost:8000";

    // loading
    const [loading, setLoading] = useState(false);

    // step state
    const [step, setStep] = useState(1);

    // input states
    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    // image states
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
   

    // ================= AVATAR =================

    const handleAvatarChange = (e) => {

        const file = e.target.files[0];

        if (file) {

            setAvatar(file);

            setAvatarPreview(
                URL.createObjectURL(file)
            );
        }
    };

    // ================= BANNER =================

    const handleBannerChange = (e) => {

        const file = e.target.files[0];

        if (file) {

            setBanner(file);

            setBannerPreview(
                URL.createObjectURL(file)
            );
        }
    };

    // ================= STEP 1 =================

    const handleContinue = () => {

        if (!channelName.trim()) {

            alert("Please enter channel name");

            return;
        }

        setStep(2);
    };

    // ================= STEP 2 =================

    const handleCustomize = () => {

        setStep(3);
    };

    // ================= UPDATE CHANNEL =================

    const handleUpdateChannel = async () => {

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("name", channelName);
            formData.append("description", description);
            formData.append("category", category);

            if (avatar) {

                formData.append("avatar", avatar);
            }

            if (banner) {

                formData.append("banner", banner);
            }

            const result = await axios.post(
                `${serverUrl}/api/user/updatechannel`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            console.log(result.data);

            // ================= IMPORTANT =================

            dispatch(
                setChannelData(result.data.channel)
            );

            alert("Channel Updated Successfully");

            // page open nahi hoga
            navigate("/");

        } catch (error) {

            console.log(error);

            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Channel Update Error"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">

            {/* ================= STEP 1 ================= */}

            {
                step === 1 && (

                    <div className="w-full max-w-sm bg-[#1f1f1f] rounded-2xl p-6 shadow-lg border border-gray-700">

                        <h1 className="text-white text-2xl font-semibold">
                            Update Channel
                        </h1>

                        <p className="text-gray-400 text-sm mt-1">
                            Change your profile picture and channel name
                        </p>

                        {/* avatar */}

                        <div className="flex flex-col items-center mt-6">

                            <label
                                htmlFor="avatar"
                                className="cursor-pointer flex flex-col items-center"
                            >

                                <div className="w-24 h-24 rounded-full bg-[#2d2d2d] overflow-hidden border border-gray-600 flex items-center justify-center">

                                    {
                                        avatarPreview ? (

                                            <img
                                                src={avatarPreview}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            <FaUserCircle
                                                size={55}
                                                className="text-gray-400"
                                            />
                                        )
                                    }

                                </div>

                                <span className="text-orange-500 mt-3 text-sm">
                                    Upload Avatar
                                </span>

                            </label>

                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />

                        </div>

                        {/* channel name */}

                        <div className="mt-6">

                            <input
                                type="text"
                                placeholder="Channel Name"
                                value={channelName}
                                onChange={(e) =>
                                    setChannelName(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-[#111111] border border-orange-500 rounded-md px-4 py-3 text-white outline-none"
                            />

                        </div>

                        {/* continue */}

                        <button
                            onClick={handleContinue}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-md mt-5"
                        >
                            Continue
                        </button>

                    </div>
                )
            }

            {/* ================= STEP 2 ================= */}

            {
                step === 2 && (

                    <div className="w-full max-w-sm bg-[#1f1f1f] rounded-2xl p-6 shadow-lg border border-gray-700">

                        <h1 className="text-white text-2xl font-semibold text-center">
                            Review Channel
                        </h1>

                        <div className="flex flex-col items-center mt-6">

                            <div className="w-24 h-24 rounded-full bg-[#2d2d2d] overflow-hidden border border-gray-600 flex items-center justify-center">

                                {
                                    avatarPreview ? (

                                        <img
                                            src={avatarPreview}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <FaUserCircle
                                            size={55}
                                            className="text-gray-400"
                                        />
                                    )
                                }

                            </div>

                            <h2 className="text-white text-lg font-semibold mt-4">
                                {channelName}
                            </h2>

                        </div>

                        <button
                            onClick={handleCustomize}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-md mt-6"
                        >
                            Continue
                        </button>

                    </div>
                )
            }

            {/* ================= STEP 3 ================= */}

            {
                step === 3 && (

                    <div className="w-full max-w-sm bg-[#1f1f1f] rounded-2xl p-6 shadow-lg border border-gray-700">

                        <h1 className="text-white text-2xl font-semibold">
                            Customize Channel
                        </h1>

                        {/* banner */}

                        <div className="mt-6">

                            <label
                                htmlFor="banner"
                                className="cursor-pointer"
                            >

                                <div className="w-full h-36 bg-[#3c465c] rounded-md overflow-hidden border border-gray-600 flex items-center justify-center">

                                    {
                                        bannerPreview ? (

                                            <img
                                                src={bannerPreview}
                                                alt="banner"
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            <p className="text-gray-300 text-sm">
                                                Click to upload banner image
                                            </p>
                                        )
                                    }

                                </div>

                            </label>

                            <input
                                type="file"
                                id="banner"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBannerChange}
                            />

                        </div>

                        {/* description */}

                        <div className="mt-5">

                            <textarea
                                rows={3}
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-[#111111] border border-orange-500 rounded-md px-4 py-3 text-white outline-none resize-none"
                            />

                        </div>

                        {/* category */}

                        <div className="mt-4">

                            <input
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-[#111111] border border-orange-500 rounded-md px-4 py-3 text-white outline-none"
                            />

                        </div>

                        {/* update */}

                        <button
                            onClick={handleUpdateChannel}
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white py-3 rounded-md mt-6"
                        >

                            {
                                loading
                                    ? "Updating..."
                                    : "Update Channel"
                            }

                        </button>

                    </div>
                )
            }

        </div>
    );
}

export default UpdateChannel;