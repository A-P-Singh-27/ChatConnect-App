import React from 'react'
import {
    MenubarSub,
    MenubarItem,
    MenubarSeparator,
    MenubarSubContent,
    MenubarSubTrigger,
} from "@/components/ui/shadcn/menubar"
import { Avatar, AvatarImage } from '../ui/shadcn/avatar'
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import { FaEye } from "react-icons/fa";


export default function Profile({ userData, children }) {
    console.log(userData);
    
    return (
        <div>
            <MenubarSub>
                <MenubarSubTrigger className='w-[100%] h-[100%]'>
                    {children ? (
                        <span>{children}</span>
                    ) : (
                        <FaEye className='text-xl text-black'/>
                    )}
                </MenubarSubTrigger>
                <MenubarSubContent>
                    <MenubarItem className='flex flex-col items-center'>
                        <Avatar className='w-[150px] h-[150px]'>
                            <AvatarImage src={userData.pic} className='w-[150px] h-[150px] cursor-pointer' />
                        </Avatar>
                        <p className='pt-4'>{userData.name}</p>
                    </MenubarItem>
                    <MenubarSeparator />
                    <div className='flex cursor-pointer'>
                        <MenubarItem className='cursor-pointer'>{userData.email}</MenubarItem>
                        <MenubarItem className='cursor-pointer'><FaInstagram /></MenubarItem>
                        <MenubarItem className='cursor-pointer'><CiFacebook /></MenubarItem>
                        <MenubarItem className='cursor-pointer'><FaWhatsapp /></MenubarItem>
                    </div>
                </MenubarSubContent>
            </MenubarSub>

        </div>
    )
}
