import { HashLoader } from '@node_modules/react-spinners'
import React from 'react'


const Loading = () => {
  return (
    <>
    <div className='my-52 px-52 text-center'>
      <HashLoader
    size={100}
    />
    </div>
    </>
  )
}

export default Loading