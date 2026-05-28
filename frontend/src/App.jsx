import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import CustomAlert from './component/CustomAlert'
import Shorts from './pages/Shorts/Shorts'
import GetCurrentUser from './customHooks/getCurrentUser'
import MobileProfile from './component/MobileProfile'
import ForgetPassword from './pages/ForgetPassword'

export const serverUrl = "http://localhost:8000"

function App() {
  return (
    <>
    <CustomAlert/>
    <GetCurrentUser />
      <Routes>
        <Route path='/' element={<Home />}>
        <Route path = '/shorts' element={<Shorts/>}/> 
        <Route path = '/mobilepro' element={<MobileProfile/>}/> 

        </Route> 
        

        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/forgetpass' element={<ForgetPassword/>} />
      </Routes>
    </>
  )
}

export default App