"use client"
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/Modals/AuthModal';
import { useRecoilValue } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

type pageProps = {
    
};

const page:React.FC<pageProps> = () => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const authModal = useRecoilValue(authModalState)
    const [pageLoading, setPageLoading] = React.useState(true)
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
                    <img src = '/hero.png' alt = 'Hero Image'/>
                </div>
                {authModal.isOpen && <AuthModal />}
            </div>
        </div>
    )
}
export default page;