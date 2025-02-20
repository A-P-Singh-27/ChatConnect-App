import React, { useState } from 'react'
import { FaUsersViewfinder } from "react-icons/fa6";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/shadcn/dialog"
import { ChatState } from '@/Context/ChatProvider';
import { Button } from '../ui/shadcn/button';
import { IoIosClose } from "react-icons/io";
import Dots from './Dots';
import { toast } from 'react-toastify';
import UserListItem from '../UserAvatar/UserListItem';


export default function UpdateGroupChatModal({ userData, token, fetchChatAgain, setFetchChatAgain, fetchMessages }) {
    const { selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const handleAddUser = async(selecteduser)=>{
        if (selectedChat.users.find((user)=>user._id === selecteduser._id)) {
            toast.success('User Already in Group!', {
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
        if (selectedChat.groupAdmin._id !== userData.id) {
            toast.error('Only Admins can add someone!', {
                position: "bottom-right",
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

            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/chat/addtogroup`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: selecteduser._id,
                    chatId: selectedChat._id,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                setLoading(false);
                toast.success('Member added to the Group', {
                    position: "top-left",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setSelectedChat(data.updatedChat);
                setFetchChatAgain(!fetchChatAgain);
                // setIsDialogOpen(false)
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
            setLoading(false);
        }
    } 

    const handleRemove = async(selecteduser) => {
        if (selectedChat.groupAdmin._id !== userData.id) {
            toast.error('Only Admins can remove someone!', {
                position: "bottom-right",
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

            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/chat/removefromgroup`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: selecteduser._id,
                    chatId: selectedChat._id,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                setLoading(false);
                toast.success('Member Removed from the Group', {
                    position: "top-left",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                selecteduser._id === userData.id ? setSelectedChat() : setSelectedChat(data.updatedChat)
                setFetchChatAgain(!fetchChatAgain)
                fetchMessages();
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
            setLoading(false);
        }
    }

      const handleSearch = async (query) => {
            setSearch(query);
            if (!query) {
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

    const handleRename = async() => {
        if(!groupChatName) return;
        try {

            setRenameLoading(true);
            
            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/chat/rename`, {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json', 
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                chatName: groupChatName,
                                chatId: selectedChat._id,
                            }),
                        });
                        if (response.ok) {
                            const data = await response.json();
                            console.log("Response:", data);
                            setSelectedChat(data.updatedChat);
                            toast.success('Group Renamed', {
                                position: "bottom-right",
                                autoClose: 1000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setFetchChatAgain(!fetchChatAgain);
                            setRenameLoading(false);
            
                        } else {
                            const error = await response.json();
                        }
                    } catch (error) {
                        console.error("Error during Login:", error);
                        toast.error('Failed to create group', {
                            position: "top-left",
                            autoClose: 1000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setRenameLoading(false);
                    }
                    setGroupChatName("");
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger><FaUsersViewfinder /></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-work flex justify-center'>{selectedChat.chatName}</DialogTitle>
                        <DialogDescription className='flex flex-col items-center'>
                            {/* selected Users */}
                            <div className='flex w-[100%] flex-wrap gap-1 py-2'>
                                {
                                    selectedChat.users?.map((user) => (
                                        <span key={user._id} className="whitespace-nowrap rounded-full h-6 bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700">
                                            {user.name}<IoIosClose className='inline text-xl' onClick={(e) => handleRemove(user)} />
                                        </span>
                                    ))
                                }
                            </div>
                            <form className='flex gap-2 w-full'>
                                <input
                                    type="text"
                                    id="Search"
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                    placeholder="GroupChat Name"
                                    className="w-full rounded-md p-2 border border-gray-400 py-2.5 pe-10 shadow-sm sm:text-sm"
                                />
                                <div>
                                    {
                                        renameLoading?(
                                            <>
                                            <Dots/>
                                            </>
                                        ):(
                                        <Button onClick={handleRename}>Update</Button>
                                        )
                                    }
                                </div>
                            </form>
                            {/* render searched users */}
                                <input
                                    type="text"
                                    id="Search"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Add Uses eg: John, Piyush, Jane" mb={1}
                                    className="w-full p-2 rounded-md border border-gray-400 py-2.5 pe-10 shadow-sm sm:text-sm"
                                />
                            {
                                loading ?
                                    <div className='flex h-10 justify-end items-center w-[100%]'>
                                        <Dots />
                                    </div> :
                                    searchResult?.slice(0, 4).map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleAddUser(user)}
                                        />
                                    ))
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='destructive' >Leave Group</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

