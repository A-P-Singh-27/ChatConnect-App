import { getSender, getSenderObject } from '@/config/ChatLogics';
import { ChatState } from '@/Context/ChatProvider'
import React, { useEffect, useState } from 'react'
import { TbArrowBackUp } from "react-icons/tb";
import Profile from './ChatuserProfile';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import Dots from './Dots';
import { toast } from 'react-toastify';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';

const ENDPOINT = "https://chat-connect-snowy.vercel.app";
var socket, selectedChatCompare;

export default function SingleChat({ userData, token, fetchChatAgain, setFetchChatAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        try {
            if (!selectedChat) {
                return ;
            }
            setLoading(true);
            const response = await fetch(`https://chat-connect-snowy.vercel.app/api/message/${selectedChat._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data.messages);
                setMessages([...messages, ...data.messages]);
                setLoading(false);
                socket.emit("join chat", selectedChat._id);
            } else {
                const error = await response.json();
            }
        } catch (error) {
            console.error("Error during Login:", error);
            toast.error('Failed to fetch chats.', {
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
    };

    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup" , userData);
        socket.on("connected", ()=> setSocketConnected(true));
        socket.on("typing", ()=>setIsTyping(true));
        socket.on("stop typing", ()=>setIsTyping(false));
    },[]);
    
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat]);
    console.log(notification);
    
    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                //give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchChatAgain(!fetchChatAgain)
                }

            }else{
                setMessages([...messages , newMessageRecieved]);
            }
        });
    });
    
    
    const sendMessage = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newMessage) {
                socket.emit("stop typing", selectedChat._id)
                try {
                    setNewMessage("");
                    const response = await fetch(`https://chat-connect-snowy.vercel.app/api/message`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            content: newMessage,
                            chatId: selectedChat._id,
                        }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Response:", data);
                        socket.emit("new message", data.message)
                        setMessages([...messages, data.message])
                        // toast.success('sent', {
                            //     position: "bottom-right",
                            //     autoClose: 1000,
                            //     hideProgressBar: true,
                            //     closeOnClick: true,
                            //     pauseOnHover: true,
                            //     draggable: true,
                            //     progress: undefined,
                            //     theme: "light",
                            // });
                            
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
        }
    };
    
    
    
    const handleTyping = async (e) => {
        setNewMessage(e.target.value);

        //typic indicator logic
        if (!socketConnected) return ;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    }
    
    
    
    
    
    return (
        <div className='w-[100%] h-[92%]'>
            {
                selectedChat ? (
                    <>
                        <p
                            className='text-lg md:text-xl pb-3 px-2 w-[100%] font-sans flex justify-between items-center'
                        >
                            <TbArrowBackUp
                                className='sm:flex md:hidden'
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                !selectedChat?.isGroupChat ? (
                                    <>
                                        {getSender(userData, selectedChat.users)}
                                        <Profile userData={getSenderObject(userData, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        {/* // update group chat modal */}
                                        <UpdateGroupChatModal userData={userData} token={token} fetchChatAgain={fetchChatAgain} setFetchChatAgain={setFetchChatAgain} fetchMessages={fetchMessages} />
                                    </>
                                )
                            }
                        </p>
                        <div className='flex flex-col justify-end p-3 bg-[#e8e8e8] w-[100%] h-[100%] rounded-lg overflow-y-hidden'>
                            {/* Message here */}
                            {
                                loading ? (
                                    <div className='w-[100%] h-[100%] flex justify-center items-center'>
                                        <Dots />
                                    </div>
                                ) : (
                                    <div className='flex flex-col overflow-y-scroll'>
                                        {/* Messages */}
                                        <ScrollableChat userData={userData} token={token} messages={messages}/>
                                    </div>
                                )
                            }
                            <form onKeyDown={sendMessage} className='m-3'>
                                {isTyping? <div className='h-5 w-full'><Dots/></div> : (<div className='h-5 w-full'></div>)}
                                <input
                                    type="text"
                                    id="Search"
                                    onChange={handleTyping}
                                    value={newMessage}
                                    placeholder="Enter message here...." mb={1}
                                    className="w-full p-2 rounded-md border bg-[#e0e0e0] border-gray-400 py-2.5 pe-10 shadow-sm sm:text-sm"
                                />
                            </form>
                        </div>
                    </>
                ) : (
                    <div>
                        Click On a User to start Chatting...
                    </div>
                )
            }
        </div>
    )
}
