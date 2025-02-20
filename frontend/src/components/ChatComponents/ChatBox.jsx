import { ChatState } from '@/Context/ChatProvider'
import React from 'react'
import SingleChat from './SingleChat';

export default function ChatBox({userData, token, fetchChatAgain, setFetchChatAgain}) {
  const {selectedChat} = ChatState();
  // console.log(selectedChat);
  

  return (
    <div className={`${selectedChat?'sm:flex': 'hidden'} md:flex bg-white items-center flex-col p-3 w-[100vw] md:w-[68%] rounded-lg border`}>
      <SingleChat userData={userData} token={token} fetchChatAgain = {fetchChatAgain} setFetchChatAgain={setFetchChatAgain}/>
    </div>
  )
}
