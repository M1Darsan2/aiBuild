import React from 'react'
import { IoMdMoon } from "react-icons/io";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
      <div className="nav flex items-center justify-between px-[120px] h-[70px]">
        <div className="logo">
          <h3 className='text-[25px] font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'>AIBuild</h3>
        </div>
        <div className="icons flex items-center gap-[15px]">
          <i className="icon bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all duration-300 cursor-pointer text-slate-200"><IoMdMoon /></i>
          <i className="icon bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all duration-300 cursor-pointer text-slate-200"><FaUser /></i>
        </div>
      </div>
    </>
  )
}

export default Navbar