
import React from 'react';
import { PulseLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className='my-52 px-52 text-center'>
      <PulseLoader size={100} />
    </div>
  );
};

export default Loading;
