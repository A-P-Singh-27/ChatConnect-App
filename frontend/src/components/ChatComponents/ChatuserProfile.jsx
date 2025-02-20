import React from 'react'
import {
    Menubar,
    MenubarItem,
    MenubarSeparator,
    MenubarContent,
    MenubarTrigger,
    MenubarMenu,
} from "@/components/ui/shadcn/menubar"
import { Avatar, AvatarImage } from '../ui/shadcn/avatar'
import { FaInstagram } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import { FaEye } from "react-icons/fa";


export default function Profile({ userData, children }) {
    return (
        <div>
            <Menubar className='border-none focus:none focus:bg-none active:bg-none'><MenubarMenu>
                <MenubarTrigger className='w-[100%] h-[100%] border-none active:bg-none'>
                    {children ? (
                        <span>{children}</span>
                    ) : (
                        <Avatar >
                            <AvatarImage src={userData.pic} className='cursor-pointer' />
                        </Avatar>
                    )}
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem className='flex flex-col items-center'>
                        <Avatar className='w-[150px] h-[150px]'>
                            <AvatarImage src="https://github.com/shadcn.png" className='w-[150px] h-[150px] cursor-pointer' />
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
                </MenubarContent>
                </MenubarMenu>
            </Menubar>

            

        </div>
    )
}


// {/* <Menubar className='border-none'>
//                         <MenubarMenu>
//                             <MenubarTrigger className='p-1 border-none'><BsBell className='cursor-pointer text-2xl m-1' /></MenubarTrigger>
//                             <MenubarContent>
//                                 {/* <MenubarItem>My Profile</MenubarItem> */}
//                                 <MenubarSeparator />
//                                 <MenubarItem>Logout</MenubarItem>
//                             </MenubarContent>
//                         </MenubarMenu>
//                         <MenubarMenu>
//                             <MenubarTrigger className='p-1 border-none'>
//                                 <Avatar>
//                                     <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
//                                 </Avatar>
//                                 <IoChevronDown className='text-lg m-1 cursor-pointer' />
//                             </MenubarTrigger>
//                             <MenubarContent>
//                                 <Profile userData={userData} >My Profile</Profile>
//                                 <MenubarSeparator />
//                                 <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
//                             </MenubarContent>
//                         </MenubarMenu>
//                     </Menubar> */}