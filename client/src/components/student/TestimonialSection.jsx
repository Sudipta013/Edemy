import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-10 w-full bg-gradient-to-b  to-cyan-100/70 mb-0'>
      <h2 className='text-3xl sm:text-4xl font-semibold text-center text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.</p>
      <div className='grid grid-cols-auto gap-8 mt-10'>
        {dummyTestimonial.map((testimonial, index) => (
          <div key={index} className='text-sm text-left border border-gray-500/50 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden' >
            <div className='flex items-center gap-4 px-4 py-4 bg-cyan-400'>
              <img src={testimonial.image} alt={testimonial.name} className='h-12 w-12 rounded-full' />
              <div>
                <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
                <p className='text-gray-800/80'>{testimonial.role}</p>
              </div>
            </div>
            <div className='p-5 pb-7'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => ( 
                    <img className='h-5' key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star"></img> 
                  ))}
                </div>
                <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
              </div>
              <a href="#" className='text-gray-500 px-5 underline'>Read more</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSection
