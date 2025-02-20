import React from 'react'
import { Avatar, AvatarImage } from '../ui/shadcn/avatar'

export default function UserListItem({ user, handleFunction }) {

    return (
        <div
            onClick={handleFunction}
            className='cursor-pointer bg-[#E8E8E8] hover:bg-[#38B2AC] hover:text-white w-[100%] flex items-center text-black px-3 py-2 mb-2 rounded-lg'
        >
            <Avatar className='mr-2'>
                <AvatarImage src={user.pic} className='cursor-pointer' />
            </Avatar>
            <div>
                <p>{user.name}</p>
                <p className='text-xs'><b>Email : </b>{user.email}</p>
            </div>
        </div>
    )
}
