import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/shadcn/dialog"
import { ChatState } from '@/Context/ChatProvider'
import { Input } from '@chakra-ui/react'
import { Button } from '../ui/shadcn/button'
import Dots from './Dots'
import UserListItem from '../UserAvatar/UserListItem'
import { toast } from 'react-toastify'
import { IoIosClose } from "react-icons/io";


export default function GroupChatModal({ children, userData, token }) {
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { chats, setChats } = ChatState();
    // console.log(token);

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.error('Please fill all the Fields');
            return;
        }
        try {
            const response = await fetch(`https://chatconnect-app.onrender.com/api/chat/group`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: groupChatName,
                    users: selectedUsers.map((user) => user._id),
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                setChats([data, ...chats]);
                toast.success('New Group Created', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setIsDialogOpen(false);

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
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.success('User already Added');
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);

            const response = await fetch(`https://chatconnect-app.onrender.com/api/user?search=${search}`, {
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

    const handleDelete = (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== userToDelete._id)
        );
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-work flex justify-center'>Create Group Chat</DialogTitle>
                        <DialogDescription className='flex flex-col items-center'>
                            <form className='flex flex-col gap-2 w-full'>
                                <input
                                    type="text"
                                    id="Search"
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                    placeholder="GroupChat Name"
                                    className="w-full rounded-md p-2 border border-gray-400 py-2.5 pe-10 shadow-sm sm:text-sm"
                                />
                                <input
                                    type="text"
                                    id="Search"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Add Uses eg: John, Piyush, Jane" mb={1}
                                    className="w-full p-2 rounded-md border border-gray-400 py-2.5 pe-10 shadow-sm sm:text-sm"
                                />
                            </form>
                            {/* selected Users */}
                            <div className='flex w-[100%] flex-wrap gap-1 py-2'>
                                {
                                    selectedUsers?.map((user) => (
                                        <span key={user._id} className="whitespace-nowrap rounded-full h-6 bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700">
                                            {user.name}<IoIosClose className='inline text-xl' onClick={(e) => handleDelete(user)} />
                                        </span>
                                    ))
                                }
                            </div>
                            {/* render searched users */}
                            {
                                loading ?
                                    <div className='flex h-10 justify-end items-center w-[100%]'>
                                        <Dots />
                                    </div> :
                                    searchResult?.slice(0, 4).map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleGroup(user)}
                                        />
                                    ))
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Create Chat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
