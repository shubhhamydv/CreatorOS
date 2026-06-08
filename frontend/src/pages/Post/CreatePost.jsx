import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa'
import { showCustomAlert } from '../../component/CustomAlert'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../../App'
import { useNavigate } from 'react-router-dom'
import { setChannelData } from '../../redux/userSlice'
import { ClipLoader } from 'react-spinners'

function CreatePost() {
  const [content,setContent] =useState("")
  const [image,setImage] = useState(null)
  const [loading,setLoaing] = useState(false)
  const {channelData} =useSelector(state=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleCreatePost = async ()=>{
    if(!content){
      showCustomAlert("post content is required")
    }
    const formData = new FormData()
    formData.append("channel" , channelData._id)
      formData.append("content",content)
      if(image) formData.append("image",image)

        setLoaing(true)
    
     try {
      const result =await axios(serverUrl +"api/content/create-post",formData,{withCredentials:true})
            const updatedChannel = {
              ...channelData,
              posts: [
                ...(channelData?.posts || []),
                result.data,
              ],
            }
      
            dispatch(setChannelData(updatedChannel))
      
            showCustomAlert('Post created successfully')
            navigate('/')
     } catch (error) {
      console.log(error)
      setLoaing(false)
      showCustomAlert("failed to create Post")
     }
  }
  return (
     <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-1 items-center justify-center'>
      <div className='bg-[#121212] p-6 rounded-lg rounded-lg max-w-2x1 shadow-lg space-y-4'>
        <textarea className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus-ring-2 focus:ring-orange-500 focus:outline-none h-28' placeholder='Write something for your community.....'onChange={(e)=>setContent(e.target.value)} value={content}></textarea>
        <label htmlFor="" className='flex items-center space-x-3 cursor-pointer'>
          <FaImage className='text-2x1 text-gray-300'/>
          <span className='text-gray-200 '>Add Image(optional)</span>
          <input type="file" className='hideen ' id='image' accept='image/*' onChange={(e)=>setImage(e.target.files[0])} />
        </label>
        {image &&<div className='mt-3'>
          <img src={URL.createObjectURL(image)} alt=''  className="rounded-lg max-h-64 object-cover"/></div>}

          <button disabled={!content || loading} className='w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center 'onClick={haddleCreatePost} >{loading ? <ClipLoader size={20} color='black' /> :"Create Post"}</button>
      </div>
     </div>
  )
}

export default CreatePost