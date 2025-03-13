import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);

  //function to become educator
  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-400 py-3 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>

      <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-22 sm:w-28 lg:w-32 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-900'>
        <div className='flex items-center gap-5'>
          {user && <>
            <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-xl text-sm px-4 py-2.5 text-center me-2 cursor-pointer' onClick={becomeEducator}>{isEducator ? "Educator Dashboard" : "Become Educator"}</button>

            <Link className='cursor-pointer bg-blue-600 px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-sm' to="/my-enrollments">My Enrollments</Link></>}
        </div>
        {
          user ? <UserButton /> :
            <button onClick={() => openSignIn()} className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2  cursor-pointer'>Create Account</button>}
      </div>

      {/* for smaller screen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-900 text-xs sm:text-sm'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {user && <>
            <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-xl ml-2 px-2 sm:px-4 py-1.5 sm:py-2.5 text-center cursor-pointer max-w-26' onClick={becomeEducator}>{isEducator ? "Dashboard" : "Become Educator"}</button>

            <Link className='cursor-pointer bg-blue-600 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-center max-w-24' to="/my-enrollments"> Enrollments</Link></>}
        </div>
        {
          user ? <UserButton /> :
            <button className='cursor-pointer bg-blue-600 p-1.5 rounded-full text-white' onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
        }

      </div>

    </div>
  )
}

export default Navbar
