import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-10'>
      <p className='text-gray-500 text-sm sm:text-base'>Trusted by learners from</p>
      <div className='flex items-center justify-center gap-5 md:gap-10 lg:gap-16 mt-5 md:mt-10'>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-14 sm:w-20 md:w-28' />
        <img src={assets.walmart_logo} alt="Walmart" className='w-14 sm:w-20 md:w-28' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-14 sm:w-20 md:w-28' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-14 sm:w-20 md:w-28' />
        <img src={assets.paypal_logo} alt="PayPal" className='w-14 sm:w-20 md:w-28' />
      </div>
    </div>
  )
}

export default Companies
