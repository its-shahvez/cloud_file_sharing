import { useUser } from '@clerk/clerk-react'
import { User } from 'lucide-react';
import React from 'react'
import {SIDE_MENU_DATA} from "../assets/data"
import { useNavigate } from 'react-router-dom';
const SideMenu = ({activeMenu}) => {
    const{user}= useUser();
    const navigate = useNavigate()
  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
        <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
            {user?.imageUrl ? (
          <img src={user?.imageUrl || ""} alt="Profile Image" className="w-20 h-20 bg-slate-400 rounded-full " />
            ) :(
                <User className='w-20h-20 text-xl'/>
            )}
            <h5 className="text-gray-950 font-medium leading-6">
                {user.fullName || ""}
           </h5>
        </div>

        {SIDE_MENU_DATA.map((item,index) =>(
             <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-200 cursor-pointer ${activeMenu == item.label ? "bg-purple-500 text-white font-medium shadow-md hover:bg-purple-600":"hover:bg-gray-100"}`}
              onClick={() =>navigate(item.path)}
              >
               <item.icon className='text-xl '/>
               {item.label}
             </button>
        ))}


    </div>
  )
}

export default SideMenu