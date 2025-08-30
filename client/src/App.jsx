import React from 'react'
import Navbar from './components/Navbar'
import GetStarted from './pages/GetStarted'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/DashBoard'
import Dash from './pages/dash'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
       <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<GetStarted />} />
        <Route path= '/dashboard' element={<Dashboard/>}/>
        <Route path= '/dash' element={<Dash/>}/>
        <Route path= '/profile' element={<Profile/>}/>
      </Routes>
    </div>
  )
}

export default App
