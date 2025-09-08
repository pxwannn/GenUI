import React from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import { IoSettingsSharp } from 'react-icons/io5'

const Navbar = () => {
  return (
    <>
        <div className="nav flex items-center justify-between px-30 h-[90px] border-b-[1px] border-gray-800 ">
            <div className="logo ">
                <h3 className='text-[25px] font-[700] sp-text'>GenUI</h3>
            </div>
            <div className="icons flex items-center gap-[15px]">
                <div className="icon"><HiSun /></div>
                <div className="icon"><FaUser /></div>
                <div className="icon"><IoSettingsSharp /></div>


            </div>
        </div>
    </>
  )
}

export default Navbar