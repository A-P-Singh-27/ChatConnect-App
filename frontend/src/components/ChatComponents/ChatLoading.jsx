import React from 'react'

export default function ChatLoading() {
  return (
    <div className='flex flex-col gap-2 mt-10 items-center'>
        {
            [1,2,3,4,5,6,7,8,1,1,].map((item,index)=>(
            <div key={index} className='w-[90%] h-10 animate-pulse bg-slate-200'></div>
            ))
        }
    </div>
  )
}
