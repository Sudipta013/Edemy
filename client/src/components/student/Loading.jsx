import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

  const { path } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000)
      return () => clearTimeout(timer);
    }
  }, [])

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-10 h-10 md:w-16 md:h-16 aspect-square border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'>
      </div>
    </div>
  )
}

export default Loading
