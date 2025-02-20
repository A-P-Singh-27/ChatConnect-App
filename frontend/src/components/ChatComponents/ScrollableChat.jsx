import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '@/config/ChatLogics'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/shadcn/avatar"


export default function ScrollableChat({ messages, userData, token }) {
    // console.log(messages);

    return (
        <ScrollableFeed>
            {
                messages &&
                messages.map((message, index) => (
                    <div
                        key={`${message._id}-${index}`}
                        className={`flex`}
                    >
                        {
                            (isSameSender(messages, message, index, userData.id)
                                ||
                                isLastMessage(messages, index, userData.id)) && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Avatar className='mt-[7px] mr-1 cursor-pointer'>
                                                <AvatarImage src={message.sender.pic} className='cursor-pointer' />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent >
                                            <p>{message.sender.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        }
                        <span 
                        className={`rounded-3xl py-[5px] px-[15px] max-w-[75%]
                            ml-${isSameSenderMargin(messages,message,index,userData.id)}
                            mt-${isSameUser(messages,message,index,userData.id) ? 3:10}
                            ${message.sender._id===userData.id? 'bg-[#bee3f8]': 'bg-[#b9f5d0]'}`}
                        >
                            {message.content}
                        </span>
                    </div>
                ))
            }
        </ScrollableFeed>
    )
}
