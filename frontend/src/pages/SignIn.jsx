import React, { useState } from 'react'
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/CreatorOS.png"
import { showCustomAlert } from '../component/CustomAlert';
import { useNavigate } from "react-router-dom";
import { serverUrl } from '../App';
  import { ClipLoader } from 'react-spinners';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
   const navigate = useNavigate()
   const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()


     const handleNext = ()=>{
        if(step == 1){
          if(!email){
          showCustomAlert("Fill all the fields")
          return
        }
      }
      
      if(step == 2){
        if(!password){
          showCustomAlert("Fill all the Fields")
          return
        }
        
      }
        setStep(step+1)
      }

      const handleSignIn = async ()=>{
        setLoading(true)
        try {
            
          const result = await axios.post(serverUrl + "/api/auth/signin", { email, password }, { withCredentials: true })
           console.log(result.data, "alert triggered")
           dispatch(setUserData(result.data))
              setLoading(false)
               showCustomAlert("User SignIn Successful")
              setTimeout(() => navigate("/"), 2000)
          
        } catch (error) {
          setLoading(false)
          console.log("Full error:", error.response.data)
          showCustomAlert(error.response.data.message || "Something went wrong")
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
             <p className='text-grey-400 text-sm mb-6'> with your Account to continue to CreatorOS</p>
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
                <div className='flex justify-between items-center mt-10'>
                  <div className='flex flex-col'>
                    <button type='button' className='text-orange-400 text-sm hover:underline text-left' onClick={() => navigate("/signup")}>Create Account</button>
                    <button type='button' className='text-gray-300 text-sm hover:underline mt-2 text-left' onClick={()=>navigate("/forgetpass")}>Forget password</button>
                  </div>
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
    
                  Welcome
    
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
                {/* <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Confirm Password'
                  className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-orange-500 mb-4'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                /> */}
    
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
                 <div className='flex justify-between items-center mt-10'>
                   <button type='button' className='text-orange-400 text-sm hover:underline' onClick={()=>navigate("/forgetpass")}>Forget password</button>
                   <button
                    type='button'
                    className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full' 
                    onClick={handleSignIn} disabled={loading}> {loading?

                      <ClipLoader color = 'black' size={20}/>:"SignIn"}
 
                   </button>
    
                  </div>
    
                {/* Submit Button */}
                {/* <div className='flex justify-end mt-10'>
    
                  <button
                    className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full'
                 
                  >
                    Next
                  </button>
    
                </div> */}
              </>
    
            )}

    
    
          </div>
    
        </div>
  )
}

export default SignIn