import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/chakra/tabs"
import Login from '@/components/Authentication/Login'
import Signup from '@/components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'


export default function Homepage() {
  const navigate = useNavigate();
  useEffect(()=>{
          const userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
              navigate('/chat');
          }
      },[navigate]);

  return (
    <div className="flex flex-col justify-center items-center w-full pt-[4rem]">
      <h2 className="text-2xl md:text-3xl lg:text-4xl bg-slate-50 p-3  mb-2 border shadow-md rounded-lg w-full sm:w-auto text-center">
        Welcome Back to ChatConnect!
      </h2>

      <div className="w-full sm:w-[63%] px-4 flex justify-center">
        <Tabs defaultValue="Login" className="w-fit p-4 py-2 rounded-2xl bg-slate-50">
          <TabsList className="w-full">
            <TabsTrigger value="Login" className="w-full rounded-full">Login</TabsTrigger>
            <TabsTrigger value="Sign Up" className="w-full rounded-full">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <Login />
          </TabsContent>
          <TabsContent value="Sign Up">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>

  )
}
