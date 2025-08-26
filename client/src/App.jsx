import React from 'react'
import Navbar from './components/Navbar'
import GetStarted from './pages/GetStarted'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<GetStarted />} />
      </Routes>
    </div>
  )
}

export default App
