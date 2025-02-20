import { ChatState } from '@/Context/ChatProvider';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button } from '../ui/shadcn/button';
import { IoMdAdd } from "react-icons/io";
import ChatLoading from './ChatLoading';
import { getSender } from '@/config/ChatLogics';
import GroupChatModal from './GroupChatModal';

export default function MyChats({ userData, token, fetchChatAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  // console.log(loggedUser);
  
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  //  console.log(chats);
   
  const fetchChat = async () => {
    // console.log(userData.id);
    
    try {

      const response = await fetch(`https://chat-connect-snowy.vercel.app/api/chat`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Response:", data);
        setChats(data);
      }else if(response.status === 401){
        localStorage.removeItem("userInfo");
      } else {
        const error = await response.json();
      }
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error('Error Occured', {
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

  useEffect(()=>{
    setLoggedUser(userData)
    fetchChat();
  },[fetchChatAgain])

  return (
    <div
    className={`${!selectedChat ? 'sm:flex' : 'hidden'} bg-white w-[100vw] md:w-[31%] md:flex flex-col items-center p-3 rounded-lg border-1`}
  >
    <div className="pb-3 px-3 sm:text-[28px] md:text-[30px] font-work flex w-[100%] justify-between items-center">
      My Chats
      <GroupChatModal userData={userData} token={token}>
      <Button className='flex sm:text-[17px] md:text-[10px] lg:text-[17px]'>New Group Chat <IoMdAdd /></Button>
      </GroupChatModal>
    </div>
    <div className='flex flex-col p-3 bg-[#f8f8f8] w-[100%] h-[100%] rounded-lg overflow-y-hidden'>
      {
        chats?(
            <div className='overflow-y-scroll'>
              {
                chats.map((chat)=>(
                  <div
                  onClick={()=>setSelectedChat(chat)}
                  className={`cursor-pointer ${selectedChat===chat? 'bg-[#38b2ac] text-white':'bg-[#e8e8e8] text-black'} px-3 py-2 rounded-lg`}
                  key={chat._id}
                  >
                    <p>
                      {!chat.isGroupChat
                      ? getSender(loggedUser,chat.users)
                      :
                      chat.chatName}
                    </p>
                  </div>
                ))
              }
            </div>
        ):(
          <ChatLoading/>
        )
      }
    </div>
  </div>
  
  )
}
