import React, { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

function CreateShort() {
  const [shortUrl, setshortUrl] =useState(null)
  const [title,setTitle] =useState("")
  const [description,setDescription] = useState("")
  const [tags,setTags] = useState("")
  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <main className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#212121] p-6 rounde-x1 w-full max-w-3x1 shadow-lg grid grid-cols-1 md:grid-cols gap-6'>
          {/* left side */}
          <div className='flex justify-center items-start'>
            <label htmlFor="short" className='flex flex-col items-center justify-center hover:border-orange-400 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-[[#181818] overflow-hidden w-[220px] aspect-[9/16]'>

               {
                shortUrl ? 
                (
                <video src={URL.createObjectURL(shortUrl)} className='h-full w-full object-cover' controls/>

                ):
                 (
                 
                 <div className='flex flex-col items-center justify-center gap-1'>
                  <FaCloudUploadAlt className='text-4xl text-gray-400 mb-2'/>
                  <p className='text-gra-300 text-xs text-center px-2'>Click to upload Short video</p>
                  <span className='text-[10px] text-gray-500 '>MP4 or MOV - Max 60s</span>

                  
                 </div>
                )
               }
            
              <input type="text"  id='short' className='hidden' accept='video/mp4,video/quicktime' onChange={(e)=>setShortUrl(e.target.files[0]) } />
            </label>
          </div>




          {/* right side */}

          <div className='flex flex-col space-y-4'>
            <input type="text" placeholder='Title*'  onChange={(e)=>setTitle(e.target.value)} value={title}className='w-full rounde-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none' />

            <textarea type="text" placeholder='Description*' onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full rounde-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none' />

            <input type="text" placeholder='Tags*' onChange={(e)=>setTags(e.target.value)} value={tags} className='w-full rounde-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none' />

            <button disabled={!title || !description || !tags}className='w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center'> Upload Short</button>
            
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateShort