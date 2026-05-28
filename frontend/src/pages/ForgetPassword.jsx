import React, { useState } from 'react'
import logo from "../assets/CreatorOS.png"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { showCustomAlert } from '../component/CustomAlert'
import { ClipLoader } from 'react-spinners'

function ForgetPassword() {

    const [step, setStep] = useState(1)

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    // ================= SEND OTP =================
    const handleSendOtp = async () => {

        setLoading(true)

        try {

            const result = await axios.post(
                serverUrl + "/api/auth/sendotp",
                { email: email.trim().toLowerCase() },
                { withCredentials: true }
            )

            console.log(result.data)

            setStep(2)

            showCustomAlert(result.data.message)

        } catch (error) {

            console.log(error)

            showCustomAlert(
                error?.response?.data?.message || "Something went wrong"
            )

        } finally {

            setLoading(false)

        }
    }

    // ================= VERIFY OTP =================
    const handleVerifyOtp = async () => {

        setLoading(true)

        try {

            const result = await axios.post(
                serverUrl + "/api/auth/verifyotp",
                { email: email.trim().toLowerCase(), otp: otp.trim() },
                { withCredentials: true }
            )

            console.log(result.data)

            setStep(3)

            showCustomAlert(result.data.message)

        } catch (error) {

            console.log(error)

            showCustomAlert(
                error?.response?.data?.message || "Something went wrong"
            )

        } finally {

            setLoading(false)

        }
    }

    // ================= RESET PASSWORD =================
    const handleResetPassword = async () => {

        setLoading(true)

        try {

            if (newPassword !== confirmPassword) {

                return showCustomAlert("Passwords do not match")

            }

            const result = await axios.post(
                serverUrl + "/api/auth/resetpassword",
                {
                    email,
                    password: newPassword
                },
                {
                    withCredentials: true
                }
            )

            console.log(result.data)

            showCustomAlert(result.data.message)

            navigate("/signin")

        } catch (error) {

            console.log(error)

            showCustomAlert(
                error?.response?.data?.message || "Something went wrong"
            )

        } finally {

            setLoading(false)

        }
    }

    return (

        <div className='min-h-screen flex flex-col bg-[#202124] text-white'>

            {/* Header */}
            <header className='flex items-center gap-2 p-4 border-b border-gray-700'>

                <img
                    src={logo}
                    alt="logo"
                    className='w-8 h-8'
                />

                <span className='text-white font-bold text-xl tracking-tight font-roboto'>
                    CreatorOS
                </span>

            </header>

            {/* Main */}
            <main className='flex flex-1 items-center justify-center px-4'>

                {/* STEP 1 */}
                {step === 1 && (

                    <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>

                        <h2 className='text-2xl font-semibold mb-6'>
                            Forget your Password
                        </h2>

                        <form
                            className='space-y-4'
                            onSubmit={(e) => e.preventDefault()}
                        >

                            <div>

                                <label
                                    htmlFor="email"
                                    className='block text-sm mb-1 text-gray-300'
                                >
                                    Enter your email address
                                </label>

                                <input
                                    type="email"
                                    id='email'
                                    className='mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />

                            </div>

                            <button
                                type="button"
                                className='w-full bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-md font-medium flex items-center justify-center'
                                disabled={loading}
                                onClick={handleSendOtp}
                            >

                                {
                                    loading
                                        ? <ClipLoader color='black' size={20} />
                                        : "Send OTP"
                                }

                            </button>

                        </form>

                        <div
                            className='text-sm text-blue-400 text-center mt-4 cursor-pointer'
                            onClick={() => navigate('/signin')}
                        >
                            Back to SignIn
                        </div>

                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (

                    <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>

                        <h2 className='text-2xl font-semibold mb-6'>
                            Enter OTP
                        </h2>

                        <form
                            className='space-y-4'
                            onSubmit={(e) => e.preventDefault()}
                        >

                            <div>

                                <label
                                    htmlFor="otp"
                                    className='block text-sm mb-1 text-gray-300'
                                >
                                    Please enter the 4-digit code sent to your email.
                                </label>

                                <input
                                type="text"
                                inputMode="numeric"
                                id='otp'
                                className='mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                required
                                onChange={(e) => setOtp(e.target.value.trim())}
                                />

                            </div>

                            <button
                                type="button"
                                className='w-full bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-md font-medium flex items-center justify-center'
                                disabled={loading}
                                onClick={handleVerifyOtp}
                            >

                                {
                                    loading
                                        ? <ClipLoader color='black' size={20} />
                                        : "Verify OTP"
                                }

                            </button>

                        </form>

                        <div
                            className='text-sm text-blue-400 text-center mt-4 cursor-pointer'
                            onClick={() => navigate('/signin')}
                        >
                            Back to SignIn
                        </div>

                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (

                    <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>

                        <h2 className='text-2xl font-semibold mb-4'>
                            Reset your Password
                        </h2>

                        <p className='text-gray-300 mb-4'>
                            Enter a new password below to regain access to your account
                        </p>

                        <form
                            className='space-y-4'
                            onSubmit={(e) => e.preventDefault()}
                        >

                            <div>

                                <label
                                    htmlFor="newpass"
                                    className='block text-sm mb-1 text-gray-300'
                                >
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    id='newpass'
                                    className='mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                />

                            </div>

                            <div>

                                <label
                                    htmlFor="compass"
                                    className='block text-sm mb-1 text-gray-300'
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id='compass'
                                    className='mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />

                            </div>

                            <button
                                type="button"
                                className='w-full bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-md font-medium flex items-center justify-center'
                                disabled={loading}
                                onClick={handleResetPassword}
                            >

                                {
                                    loading
                                        ? <ClipLoader color='black' size={20} />
                                        : "Reset Password"
                                }

                            </button>

                        </form>

                        <div
                            className='text-sm text-blue-400 text-center mt-4 cursor-pointer'
                            onClick={() => navigate('/signin')}
                        >
                            Back to SignIn
                        </div>

                    </div>
                )}

            </main>

        </div>
    )
}

export default ForgetPassword