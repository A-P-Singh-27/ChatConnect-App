import ChatBox from '@/components/ChatComponents/ChatBox';
import MyChats from '@/components/ChatComponents/MyChats';
import SideDrawer from '@/components/ChatComponents/SideDrawer';
import { ChatState } from '@/Context/ChatProvider'
import {jwtDecode} from 'jwt-decode';

import React, { useEffect, useState } from 'react'

export default function Chatpage() {
    const {user} = ChatState();
    const [fetchChatAgain , setFetchChatAgain] = useState(false);
    let decodedData , userData
    if (user) {
        userData = JSON.parse(user);
        // console.log("User JSON:", userData);
        try {
            decodedData = jwtDecode(userData.token);
            // console.log("Decoded Token:", decodedData);
        } catch (error) {
            console.error("Invalid Token:", error.message);
        }
    }
    
    
    
    
    

  return (
    <div className='w-full'>
      {user && <SideDrawer userData={decodedData} token={userData.token} />}
      <div className='flex justify-between w-full h-[91.5vh] p-2'>
        {user && <MyChats userData={decodedData} token={userData.token} fetchChatAgain = {fetchChatAgain}/>}
        {user && <ChatBox userData={decodedData} token={userData.token} fetchChatAgain = {fetchChatAgain} setFetchChatAgain={setFetchChatAgain}/>}
      </div>
    </div>
  )
}
