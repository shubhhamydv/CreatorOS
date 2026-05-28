import React, { useState } from 'react'
import logo from "../assets/CreatorOS.png"
import { useNavigate } from 'react-router-dom'
function ForgetPassword() {
    const [step,setStep] = useState(3)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [newPassword,setnewPassword] = useState("")
    const [confirmPassword,setConfirmPassword]= useState("")
    const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col bg-[#202124] text-white'>
        <header className='flex items-center gap-2 p-4 border-b border-gray-700'>
            <img src={logo} alt="" className='w-8 h-8' />
            <span className='text-white font-nold text-x1 tracking-tight font-roboto'></span>
        </header>
        <main className='flex flex-1 items-center justify-center px-4'>
            {step === 1 &&<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md  w-full'>
                <h2 className='text-2x1 font-semibold mb-6 '> Forget your Password</h2>
                <form action="" className='space-y-4 '>
                    <div className=''> 
                        <label htmlFor="email" className='block text-sm mb-1 text-gray-300'>Enter your email address </label>
                        <input type="text" id='email' className='mt-1 w-full px-4 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required onChange={(e)=>setOtp(e.target.value)} value={otp} />
                    </div>
                    <button className='w-full bg-orange-600 hover:bg-orange-700 tracking-normalp-2 px-4 rounded-md font-medium'>verify OTP</button>
                </form>
                <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate('/signin')} > Back to signIn</div>
                </div>}

                   {step === 2 &&<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md  w-full'>
                <h2 className='text-2x1 font-semibold mb-6 '>Enter OTP</h2>
                <form action="" className='space-y-4 '>
                    <div className=''> 
                        <label htmlFor="otp" className='block text-sm mb-1 text-gray-300'>Please enter the 4-digit code sent to yuor email. </label>
                        <input type="text" id='otp' className='mt-1 w-full px-4 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required onChange={(e)=>setEmail(e.target.value)} value={email} />
                    </div>
                    <button className='w-full bg-orange-600 hover:bg-orange-700 tracking-normalp-2 px-4 rounded-md font-medium'>Send OTP</button>
                </form>
                <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate('/signin')} > Back to signIn</div>
                </div>}

                   {step === 3 &&<div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md  w-full'>
                <h2 className='text-2x1 font-semibold mb-6 '> Reset your Password</h2>
                <p>Enter a new password below to regain accesss to your account</p>
                <form action="" className='space-y-4 '>
                    <div className=''> 
                        <label htmlFor="newpass" className='block text-sm mb-1 text-gray-300 mt-[20px]'>New Password </label>
                        <input type="text" id='newpass' className='mt-1 w-full px-4 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required onChange={(e)=>setnewPassword(e.target.value)} value={newPassword} />
                         <label htmlFor="compass" className='block text-sm mb-1 text-gray-300'>Confirm Password </label>
                        <input type="text" id='compass' className='mt-1 w-full px-4 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-orange-500' required onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} />
                    </div>
                    <button className='w-full bg-orange-600 hover:bg-orange-700 tracking-normalp-2 px-4 rounded-md font-medium'>Reset password</button>
                </form>
                <div className='text-sm text-blue-400 text-center mt-4 cursor-pointer' onClick={()=>navigate('/signin')} > Back to signIn</div>
                </div>}
        </main>
    </div>
  )
}

export default ForgetPassword