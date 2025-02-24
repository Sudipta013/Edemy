import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-10 h-10 md:w-16 md:h-16 aspect-square border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'>
      </div>
    </div>
  )
}

export default Loading
