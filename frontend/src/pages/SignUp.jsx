import React, { useState } from 'react'
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/CreatorOS.png"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import {serverUrl} from '../App';
import {ClipLoader} from 'react-spinner'
import { showCustomAlert } from '../component/CustomAlert';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {

  const [step, setStep] = useState(1) 

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [backendImage, setBackendImage] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null)
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleNext = ()=>{
    if(step == 1){
      if(!userName || !email){
      showCustomAlert("Fill all the fields")
      return
    }
  }
  
  if(step == 2){
    if(!password || !confirmPassword){
      showCustomAlert("Fill all the Fields")
      return
    }
    if(password !== confirmPassword){
      showCustomAlert("Password doesn't match")
      return
    }
  }
    setStep(step+1)
  }

  const handleImage = (e)=>{
    const file = e.target.files[0]
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file))
  }

const handleSignUp = async () =>{
  if(!backendImage){
    showCustomAlert("Please choose a profile image")
    return
  }

  setLoading(true)
  const formData = new FormData()
  formData.append("userName", userName.trim())
  formData.append("email", email.trim())
  formData.append("password", password)
  formData.append("photoUrl", backendImage)

  try {
    const result = await axios.post(serverUrl + "/api/auth/signup", formData, {withCredentials:true})
    console.log(result.data)
    dispatch(setUserData(result.data))
    setLoading(false)
    showCustomAlert("Signup Successful")
    navigate("/")
  } catch (error) {
    setLoading(false)
    const message = error?.response?.data?.message || error?.message || "Signup failed"
    console.log("Signup error:", message)
    showCustomAlert(message)
  }
}

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
                type='button'
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
                onClick={handleNext}
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
              {
                frontendImage ? <img src={frontendImage} className='w-full h-full object-cover'/>
              

              :<FaUserCircle className='text-gray-500 w-full h-full p-2'/>}
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="" className='text-grey-300 font-medium'>Choose Profile Picture</label>
              <input type="file" accept='image/*' onChange={handleImage} className='block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer' />
            </div>
          </div>
            {/* Submit Button */}
            <div className='flex justify-end mt-10'>

              <button
                type='button'
                className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full'
                onClick={handleSignUp} disabled={loading}>
               {loading ? "Creating Account..." : "Create Account"} 
              </button>

            </div>
          </>

        )}


      </div>

    </div>
  )
}

export default SignUp