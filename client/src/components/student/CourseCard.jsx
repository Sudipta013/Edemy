import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {

  const { currency, calcAvgRating } = useContext(AppContext);

  return (
    <Link to={'/course/' + course._id} onClick={() => window.scrollTo(0, 0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
      <img className='w-full' src={course.courseThumbnail} alt="" />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        <p className='text-gray-500'>Alex Mathew</p>
        <div className='flex items-center space-x-2'>
          <p>{calcAvgRating(course).toFixed(1)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img className='w-3.5 h-3.5' key={i} src={i < Math.floor(calcAvgRating(course)) ? assets.star : assets.star_blank} alt="" />
            ))}
          </div>
          <p className='text-gray-400'>{course.courseRatings.length}{course.courseRatings.length > 1 ? "reviews" : " review"}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - (course.coursePrice * course.discount / 100)).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
