import React from 'react'
import { DotLoader } from 'react-spinners'


const Loading = () => {
  return (
    <>
    <div className='my-52 px-52 text-center'>
      <DotLoader
    size={100}
    />
    </div>
    </>
  )
}

export default Loading