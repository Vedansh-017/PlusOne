import React from "react";
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white text-primary shadow-lg">
      {/* Logo */}
      <h1 onClick={()=>(navigate('/'))} className="text-2xl font-bold tracking-wide mx-2 cursor-pointer">plus <span className="text-black">ONE</span></h1>

      {/* Navigation / Right Section */}
      <div className="flex items-center gap-4">
        <button className=" cursor-pointer mx-4 px-4 py-2 rounded-xl bg-primary transition-transform duration-300 hover:scale-110 text-white" onClick={()=> navigate('/profile')} >
          Profile
        </button>
      </div>
    </div>
  );
};

export default Navbar;
