import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
export const Header = () => {
    const {user,isSignedIn} = useUser();
  return (
    <div className='w-full bg-white p-5 px-5 flex justify-between items-center shadow-md fixed top-0 left-0 z-50'>
        <img src="/logo.svg" width={100} height={100}/>

        {isSignedIn ? 
            <div className='flex gap-2 items-center'>
            <Link to={'/dashboard'}></Link>
            <Button variant = 'outline'>Dashboard</Button>
            <UserButton />
            </div> :
            <Link to={'/auth/signin'}>
           <Button variant = 'default'> Get Started </Button>
           </Link>
        }
    </div>
  )
}
