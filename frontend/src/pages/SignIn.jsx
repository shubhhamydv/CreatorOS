import React, { useState } from 'react'
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/CreatorOS.png"


function SignIn() {
   const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
  
    const [password, setPassword] = useState("")
  return (
     <div className='flex items-center justify-center min-h-screen bg-[#181818]'>
    
          <div className='bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg'>
    
            {/* Header */}
            <div className='flex items-center mb-6'>
    
              <button
                className='text-gray-300 mr-3 hover:text-white'
                onClick={() => {
                  if(step > 1){
    
                   setStep(step - 1)
                  } else{
                    navigate("/")
    
    
                  }
                }}>
    
                <FaArrowLeft size={20} />
              </button>
    
              <span className='text-white text-2xl font-medium'>
                CreatorOS
              </span>
    
            </div>
    
            {/* STEP 1 */}
            {step === 1 && (
    
              <>
                <h1 className='text-3xl font-normal text-white mb-5 flex items-center gap-2'>
                  <img
                    src={logo}
                    alt="logo"
                    className='w-8 h-8'
                  />
                  SignIn
                </h1>
             <p className=''> with your Account to continue to CreatorOS</p>
                {/* Username */}
                
    
                {/* Email */}
                <input
                  type="email"
                  placeholder='Email'
                  className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
    
                {/* Next Button */}
                <div className='flex justify-end mt-10'>
                  <button></button>
                  <button
                    className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full' 
                    onClick={handleNext}
                   >
                    Next
                  </button>
    
                </div>
              </>
    
            )}
    
            {/* STEP 2 */}
            {step === 2 && (
    
              <>
                <h1 className='text-3xl font-normal text-white mb-5 flex items-center gap-2'>
    
                  <img
                    src={logo}
                    alt="logo"
                    className='w-8 h-8'
                  />
    
                  Security
    
                </h1>
    
                {/* Email Preview */}
                <div className='flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6'>
    
                  <FaUserCircle
                    className='mr-2'
                    size={20}
                  />
    
                  {email}
    
                </div>
    
                {/* Password */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Password'
                  className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
    
                {/* Confirm Password */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Confirm Password'
                  className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
    
                {/* Show Password */}
                <div className='flex items-center gap-2 mt-3'>
    
                  <input
                    type="checkbox"
                    id='showpass'
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
    
                  <label
                    className='text-gray-300 cursor-pointer'
                    htmlFor="showpass"
                  >
                    Show Password
                  </label>
    
                </div>
    
                {/* Submit Button */}
                <div className='flex justify-end mt-10'>
    
                  <button
                    className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full'
                 
                  >
                    Next
                  </button>
    
                </div>
              </>
    
            )}

    
    
          </div>
    
        </div>
  )
}

export default SignIn