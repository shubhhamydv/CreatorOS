import { useDispatch, useSelector } from "react-redux"
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function Profile() {

    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignout = async () => {
         try{
            const result = await axios.get(serverUrl + "/api/auth/signout",{withCredentials:true})
            dispatch(setUserData(null))
            localStorage.removeItem('userData')
            console.log(result.data)
            showCustomAlert("Signout Successfully")
         } catch(error){
         console.log(error)
         showCustomAlert("Signout error")
         }
    }

    const handleGoogleAuth = async ()=>{
        try{
            const response = await signInWithPopup(auth, provider)
            const user = response.user
            const photo = user.photoURL || user.providerData?.[0]?.photoURL || ""
            const name = user.displayName || user.providerData?.[0]?.displayName || ""
            const googleUser = {
                email: user.email,
                userName: name,
                photoUrl: photo,
                photoURL: photo
            }
            console.log("Google user data:", googleUser)
            dispatch(setUserData(googleUser))
            localStorage.setItem('userData', JSON.stringify(googleUser))
            showCustomAlert("Google Authentication successful")
        } catch(error){
         console.log(error)
         showCustomAlert("Google sign-in failed")
        }
    }
    return (
        <div>

            <div className='absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:block'>

                {userData && (
                    <div className='flex items-center gap-3 p-4 border-b border-gray-700'>

                        <img
                            src={userData?.photoUrl || userData?.photoURL}
                            alt=""
                            className='w-12 h-12 flex items-center justify-center rounded-full object-cover border border-gray-700'
                        />

                        <div>

                            <h4 className='font-semibold'>
                                {userData?.userName}
                            </h4>

                            <p className='text-sm text-gray-400'>
                                {userData?.email}
                            </p>

                            <p className='text-sm text-blue-400 cursor-pointer hover:underline'>
                                {userData?.channel
                                    ? "view channel"
                                    : "create channel"}
                            </p>

                        </div>

                    </div>
                )}

                <div className="flex flex-col py-2">

                    <button type='button' className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={handleGoogleAuth}>
                        <FcGoogle className='text-xl' />
                        Signin with google account
                    </button>

                    <button type='button' className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={() => navigate("/signup")}>
                        <TiUserAddOutline className='text-xl' />
                        Create New Account
                    </button>

                    <button type='button' className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={() => navigate("/signin")}>
                        <MdOutlineSwitchAccount className='text-xl' />
                        SignIn with other account
                    </button>

                    {userData?.channel && (
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700">
                            <SiYoutubestudio className='text-xl' />
                            PT Studio
                        </button>
                    )}

                    {userData && (
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={handleSignout}>
                            <FiLogOut className='text-xl' />
                            Signout
                        </button>
                    )}

                </div>

            </div>

        </div>
    )
}

export default Profile