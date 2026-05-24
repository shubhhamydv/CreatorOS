import React, { useState } from 'react'
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/playtube1.png"

function SignUp() {

  const [step, setStep] = useState(3)

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  return (

    <div className='flex items-center justify-center min-h-screen bg-[#181818]'>

      <div className='bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg'>

        {/* Header */}
        <div className='flex items-center mb-6'>

          <button
            className='text-gray-300 mr-3 hover:text-white'
            onClick={() => step > 1 && setStep(step - 1)}
          >
            <FaArrowLeft size={20} />
          </button>

          <span className='text-white text-2xl font-medium'>
            Create Account
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
              Basic Info
            </h1>

            {/* Username */}
            <input
              type="text"
              placeholder='Username'
              className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4'
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />

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

              <button
                className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full'
                onClick={() => setStep(2)}
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

         {/* STEP 3 */}
        {step === 3 && (

          <>
            <h1 className='text-3xl font-normal text-white mb-5 flex items-center gap-2'>

              <img
                src={logo}
                alt="logo"
                className='w-8 h-8'
              />

              Choose Avatar

            </h1>

          <div className='flex items-center gap-6 mb-6'>
            <div className='w-28 h-28 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg'>
              <FaUserCircle className='text-gray-500 w-full h-full p-2'/>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="" className='text-grey-300 font-medium'>Choose Profile Picture</label>
              <input type="file" accept='image/*' className='block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer' />
            </div>
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

export default SignUp