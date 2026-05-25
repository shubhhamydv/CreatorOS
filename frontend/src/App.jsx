import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import CustomAlert from './component/CustomAlert'

export const serverUrl = "http://localhost:8000"

function App() {
  return (
    <>
    <CustomAlert/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App