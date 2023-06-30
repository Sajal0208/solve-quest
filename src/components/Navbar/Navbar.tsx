import React from 'react';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import Image from 'next/image';
import { authModalState } from '@/atoms/authModalAtom';
type NavbarProps = {

};

const Navbar: React.FC<NavbarProps> = () => {
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
        {/* <Link href = '/' className = "flex items-center justify-center h-20">
            <Image src = '/2.png' alt = "solve-quest" width = {200} height = {200} />
        </Link> */}
        <Link href='/' className='flex h-[22px] flex mt-5 text-brand-orange'>
            <img src='/2.png' alt='Logo' className='h-full justify-content mr-2' />
            <p>SolveQuest</p>
        </Link>
        <div className="flex items-center">
            <button onClick={handleClick} className='mt-5 bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange'>
                Sign In
            </button>
        </div>

    </div>
}
export default Navbar;