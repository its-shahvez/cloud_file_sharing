import { useUser } from '@clerk/clerk-react'
import React from 'react'
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';

const DashboardLayout = ({children, activeMenu}) => {
   const {user}  = useUser();
  return (
    <div>
        {/*Navbar components goes here */}
        <Navbar activeMenu={activeMenu}/>
        {user &&(
            <div className="flex">
                <div className='max-[1080px]:hidden'>
                    {/**Side menu goes here */}
                   <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className="grow mx-5">{children}</div>
            </div>
        )}

    </div>
  )
}

export default DashboardLayout