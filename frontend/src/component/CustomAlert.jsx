import React, { useEffect, useState } from 'react'

let alertHandle;

export const showCustomAlert = (message) => {
  if (alertHandle) {
    alertHandle(message)
  }
}

function CustomAlert() {
  const [message, setMessage] = useState("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    alertHandle = (nextMessage) => {
      setMessage(nextMessage)
      setVisible(true)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className='fixed inset-0 flex items-start justify-center pt-[50px] bg-black/50 z-50'>
      <div className='bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80'>
        <p className='text-sm'>{message}</p>
        <div className='flex justify-end mt-10'>
          <button
            className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full'
            onClick={() => setVisible(false)}
          >
            ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert