"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/Modals/AuthModal';
import { useRecoilValue } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Image from 'next/image';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

type PageProps = {
    
};

const Page:React.FC<PageProps> = () => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const authModal = useRecoilValue(authModalState)
    const [pageLoading, setPageLoading] = useState(true)
    useEffect(() => {
        if(user) router.push('/')
        if(!loading && !user) setPageLoading(false)
    }, [user, router, loading])
    if(pageLoading) return null;

    return (
        <div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
            <div className='max-w-7xl mx-auto'>
                <Navbar />
                <div className='flex itmes-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
                    <Image src = '/hero.png' alt = 'Hero Image' width={700} height={700} />
                </div>
                {authModal.isOpen && <AuthModal />}
            </div>
        </div>
    )
}
export default Page;