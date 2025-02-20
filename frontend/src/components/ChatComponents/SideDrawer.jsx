import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { BsBell } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/shadcn/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/shadcn/menubar"
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerActionTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/chakra/drawer"

import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/shadcn/button';
import { toast } from 'react-toastify';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '@/Context/ChatProvider';
import Dots from './Dots';
import { getSender } from '@/config/ChatLogics';



export default function SideDrawer({ userData, token }) {
    const { setSelectedChat, selectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }
    // console.log(userData);

    

    const handleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }
    const handleSearch = async () => {
        console.log(search);
        if (!search) {

            toast.error('Please enter something in the search', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/user?search=${search}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                setLoading(false);
                setSearchResult(data);
            } else {
                const error = await response.json();
            }
        } catch (error) {
            console.error("Error during Login:", error);
            toast.error('Failed to search the user', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }

    const accesChat = async (userId) => {
        console.log(userId);


        try {

            setLoadingChat(true);
            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/chat?search=${search}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: userId })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                if (Array.isArray(chats) && !chats.find((c) => c._id === data._id)) {
                    setChats([data, ...chats]);
                }
                setLoadingChat(false);
                setSelectedChat(data);
                setDrawerOpen(!drawerOpen);
            } else {
                const error = await response.json();
            }
        } catch (error) {
            console.error("Error during Login:", error);
            toast.error('Error Fetching the chat', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }


    return (
        <>
            <div className='flex justify-between items-center bg-white w-full py-1 px-2 md:py-2 md:px-2 border-4'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant='ghost' onClick={handleDrawer}>
                                <CiSearch />
                                <p className='hidden md:flex px-1'>Search User</p>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent >
                            <p>Search Users to Chat</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <p className='font-mono'>Connect & Chat with ChatConnect</p>
                <div>
                    <Menubar className='border-none'>
                        <MenubarMenu>
                            <MenubarTrigger className='p-1 border-none relative'>
                                {
                                    notification&&notification.length ? <div className='absolute text-white bg-red-600 w-4  h-4 flex justify-center items-center left-5 bottom-5 rounded-full'>
                                    {notification.length}
                                </div> : <></>
                                }
                                <BsBell className='cursor-pointer text-2xl m-1' />
                                </MenubarTrigger>
                            <MenubarContent>
                                {/* <MenubarItem>My Profile</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Logout</MenubarItem> */}
                                <MenubarItem>
                                {!notification.length && "No New Message"}
                                {notification?.map((notify)=>(
                                    <MenubarItem key={notify._id} onClick={()=>{
                                        setSelectedChat(notify.chat);
                                        setNotification(notification.filter((n)=> n !== notify));
                                        }}>
                                        {notify.chat.isGroupChat?
                                         `New Message in ${notify.chat.chatName}`
                                        : `New Message by ${getSender(userData , notify.chat.users)}`}
                                    </MenubarItem>
                                ))}
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger className='p-1 border-none'>
                                <Avatar>
                                    <AvatarImage src={userData.pic} className='cursor-pointer' />
                                </Avatar>
                                <IoChevronDown className='text-lg m-1 cursor-pointer' />
                            </MenubarTrigger>
                            <MenubarContent>
                                <Profile userData={userData} >My Profile</Profile>
                                <MenubarSeparator />
                                <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>

            <DrawerRoot open={drawerOpen} onOpenChange={handleDrawer} placement="start">
                <DrawerBackdrop />
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className='font-bold text-xl'>Search User</DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <div className='felx pb-2 w-[100%] h-10'>
                            <input
                                className='mr-2 p-2 border-2 border-gray-200 rounded-lg w-[78%]'
                                type="text"
                                placeholder='Search by name or email'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch} variant='ghost' className='bg-gray-200'>
                                Go
                            </Button>
                        </div>
                        {
                            loading ? (
                                <ChatLoading />
                            ) : (
                                <div className='mt-4'>
                                    {searchResult?.map((user, index) => (
                                        <UserListItem key={index}
                                            user={user}
                                            handleFunction={() => accesChat(user._id)}
                                        />
                                    ))}
                                </div>
                            )
                        }
                        {
                            loadingChat && <div className='flex h-10 justify-end items-center w-[100%]'>
                                <Dots />
                            </div>
                        }
                    </DrawerBody>
                    <DrawerFooter>

                    </DrawerFooter>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>

        </>
    )
}
