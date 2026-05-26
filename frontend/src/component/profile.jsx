import { useSelector } from "react-redux"
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
function Profile() {

    const { userData } = useSelector(state => state.user)

    return (
        <div>

            <div className='absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50'>

                {userData && (
                    <div className='flex items-center gap-3 p-4 border-b border-gray-700'>

                        <img
                            src={userData?.photoUrl}
                            alt=""
                            className='w-12 h-12 flex items-center justify-center rounded-full object-cover border-1 border-gray-700'
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
                    <button className="flex items-center gap-3 px-4 py-2 hover;bg-gray-700" ><FcGoogle className='text-x1'/> Signin with google account</button>
                     <button className="flex items-center gap-3 px-4 py-2 hover;bg-gray-700" ><TiUserAddOutline className='text-x1'/> Create New Account</button>
                      <button className="flex items-center gap-3 px-4 py-2 hover;bg-gray-700" ><MdOutlineSwitchAccount className='text-x1'/> SignIn with other account</button>
                       { userData?.channel &&<button className="flex items-center gap-3 px-4 py-2 hover;bg-gray-700" ><SiYoutubestudio className='text-x1'/> PT Studio</button>}
                        { userData && <button className="flex items-center gap-3 px-4 py-2 hover;bg-gray-700" ><FiLogOut className='text-x1'/> Signout</button>}
                </div>

            </div>

        </div>
    )
}

export default Profile