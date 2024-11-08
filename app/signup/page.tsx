'use client'

import Auth from "@/components/auth"

export default function  Signin(){
    return (
      <div className="flex flex-col md:flex-row h-screen fixed   w-full">
     
      <div className="flex w-full md:h-[115%]    border-2 self-center justify-center items-center">
        <Auth type="signup" />
      </div>
      </div>
    )
}