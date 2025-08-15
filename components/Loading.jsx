import React from 'react'
import { PulseLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className='my-52 px-52 text-center'>
      <PulseLoader
        color="#d2d4d6"
        size={17}
        speedMultiplier={0.7}
      />
    </div>
  )
}

export default Loading