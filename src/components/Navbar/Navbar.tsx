import React from 'react';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import Image from 'next/image';
import { authModalState } from '@/atoms/authModalAtom';
type NavbarProps = {
    
};

const Navbar:React.FC<NavbarProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)

    const handleClick = () => {
        setAuthModalState((prevState) => {
            return {
                ...prevState,
                isOpen: true
            }
        })
    }

    return <div className='flex items-center justify-between sm:px-12 px-2 md:px-24'>
        <Link href = '/' className = "flex items-center justify-center h-20">
            <Image src = '/logo.png' alt = "solve-quest" width = {200} height = {200} />
        </Link>
        <div className="flex items-center">
            <button onClick={handleClick} className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange'>
                Sign In
            </button>
        </div>

    </div>
}
export default Navbar;