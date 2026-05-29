import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { serverUrl } from "../../App";

function CreateChannel() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // input states
    const [channelName, setChannelName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    // image preview states
    const [avatarPreview, setAvatarPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");

    // image file states
    const [avatarFile, setAvatarFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    // loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // ================= AVATAR IMAGE =================
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // ================= BANNER IMAGE =================
    const handleBannerChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    // ================= STEP 1 VALIDATION =================
    const handleContinueStep1 = () => {
        if (!channelName.trim()) {
            setError("Please enter channel name");
            return;
        }

        setError("");
        setStep(2);
    };

    // ================= STEP 2 VALIDATION =================
    const handleContinueStep2 = () => {
        if (!description.trim() || !category.trim()) {
            setError("Please enter description and category");
            return;
        }

        setError("");
        setStep(3);
    };

    // ================= CREATE CHANNEL =================
    const handleCreateChannel = async () => {
        try {
            setIsSubmitting(true);
            setError("");

            const formData = new FormData();

            formData.append("chanelname", channelName);
            formData.append("description", description);
            formData.append("category", category);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            const result = await axios.post(
                `${serverUrl}/api/user/createchannel`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(result.data);

            alert("Channel Created Successfully");

            navigate("/viewchannel");
        } catch (err) {
            console.log(err);

            const message =
                err.response?.data?.message ||
                "Unable to create channel";

            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090A0F] flex items-center justify-center px-4 py-10">
            
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
                <main className="w-full max-w-sm rounded-3xl bg-[#13151C] border border-gray-700 p-6 shadow-lg">
                    
                    <div className="mb-5 flex items-center justify-between text-xs text-gray-400">
                        <span>Step 1 of 3</span>

                        <span className="font-semibold text-white">
                            Create Channel
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        
                        {/* Avatar Upload */}
                        <label
                            htmlFor="avatar"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle
                                        size={50}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>

                            <span className="text-orange-400 text-sm">
                                Upload Avatar
                            </span>
                        </label>

                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />

                        {/* Channel Name */}
                        <input
                            type="text"
                            placeholder="Channel Name"
                            value={channelName}
                            onChange={(e) =>
                                setChannelName(e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-[#121212] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        {/* Continue Button */}
                        <button
                            onClick={handleContinueStep1}
                            className="w-full bg-orange-600 hover:bg-orange-500 transition-all text-white py-3 rounded-full font-medium"
                        >
                            Continue
                        </button>

                        {/* Cancel */}
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </main>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
                <main className="w-full max-w-sm rounded-3xl bg-[#13151C] border border-gray-700 p-6 shadow-lg">
                    
                    <div className="mb-5 flex items-center justify-between text-xs text-gray-400">
                        <span>Step 2 of 3</span>

                        <span className="font-semibold text-white">
                            Channel Details
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        
                        {/* Banner Upload */}
                        <label className="text-sm text-gray-300">
                            Banner Image
                        </label>

                        <div
                            onClick={() =>
                                document
                                    .getElementById("banner")
                                    ?.click()
                            }
                            className="w-full h-32 rounded-2xl bg-[#121212] border border-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            {bannerPreview ? (
                                <img
                                    src={bannerPreview}
                                    alt="banner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    Click to upload banner
                                </span>
                            )}
                        </div>

                        <input
                            id="banner"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerChange}
                        />

                        {/* Description */}
                        <textarea
                            rows={4}
                            placeholder="Channel Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-[#121212] border border-gray-700 text-white outline-none resize-none focus:ring-2 focus:ring-orange-500"
                        />

                        {/* Category */}
                        <input
                            type="text"
                            placeholder="Channel Category"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-[#121212] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-orange-500"
                        />

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        {/* Continue */}
                        <button
                            onClick={handleContinueStep2}
                            className="w-full bg-orange-600 hover:bg-orange-500 transition-all text-white py-3 rounded-full font-medium"
                        >
                            Continue
                        </button>

                        {/* Back */}
                        <button
                            onClick={() => setStep(1)}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Back
                        </button>
                    </div>
                </main>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
                <main className="w-full max-w-sm rounded-3xl bg-[#13151C] border border-gray-700 p-6 shadow-lg">
                    
                    <div className="mb-5 flex items-center justify-between text-xs text-gray-400">
                        <span>Step 3 of 3</span>

                        <span className="font-semibold text-white">
                            Review Channel
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        
                        <div className="rounded-2xl bg-[#121212] border border-gray-700 p-4">
                            
                            <div className="flex items-center gap-3">
                                
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle
                                            size={30}
                                            className="text-gray-400"
                                        />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-white font-semibold text-lg">
                                        {channelName}
                                    </h2>

                                    <p className="text-sm text-gray-400">
                                        {category}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs text-gray-400 mb-1">
                                    Description
                                </p>

                                <p className="text-sm text-gray-200">
                                    {description}
                                </p>
                            </div>

                            {bannerPreview && (
                                <div className="mt-4 overflow-hidden rounded-2xl">
                                    <img
                                        src={bannerPreview}
                                        alt="banner"
                                        className="w-full h-32 object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        {/* Create Channel */}
                        <button
                            onClick={handleCreateChannel}
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all text-white py-3 rounded-full font-medium"
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create Channel"}
                        </button>

                        {/* Back */}
                        <button
                            onClick={() => setStep(2)}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Back
                        </button>
                    </div>
                </main>
            )}
        </div>
    );
}

export default CreateChannel;