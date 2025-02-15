import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 md:px-0 bg-gradient-to-b  from-cyan-100/70 w-full'>
      <h1 className='text-2xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h1>
      <p className='text-gray-500 sm:text-medium px-2'>Boost your skills with expert-led courses designed for flexible learning. Start your journey today!</p>
      <div className='flex items-center gap-3 md:gap-6 font-medium mt-4'>
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl active:scale-95">
          Start Learning
        </button>

        <button className="px-6 py-3 flex items-center gap-2 bg-white border-2 border-cyan-500 text-cyan-500 font-semibold text-lg rounded-full shadow-md transition-all hover:bg-cyan-500 hover:text-white hover:shadow-lg active:scale-95">
          Learn More
          <img src={assets.arrow_icon} alt="arrow_icon" className="w-5 h-5 transition-transform transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

export default CallToAction
