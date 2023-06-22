"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logout from '../Buttons/Logout';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import Timer from '../Timer/Timer';
import { useRouter } from 'next/router';
import { Problem } from '@/utils/types/problem';
import { problems } from '@/utils/problems';

type TopbarProps = {
    problemPage?: boolean
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState)
    const [order, setOrder] = useState<Number>(0)
    const router = useRouter();
    
    const totalNumberOfProblems = Object.keys(problems).length
    const handleProblemChange = (isForward: boolean) => {
        const { order } = problems[router.query.pid as string] as Problem
        const direction = isForward ? 1 : -1
        const nextProblemOrder = order + direction
        const nextProblemKey = Object.keys(problems).find((key) => problems[key].order === nextProblemOrder)

        if(isForward && !nextProblemKey) {
            return;
        } else if (!isForward && !nextProblemKey) {
            return;
        } else {
            router.push(`/problems/${nextProblemKey}`)
        }
    }

    useEffect(() => {
        if(!router.query.pid) {
            setOrder(0)
        } else {
            const { order } = problems[router.query.pid as string] as Problem
            setOrder(order)
        }
    }, [router.query.pid])

    return <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
        <div className={`flex w-full items-center justify-between ${problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
            <Link href='/' className='h-[22px] flex-1'>
                <img src='/logo-full.png' alt='Logo' className='h-full' />
            </Link>

            {problemPage &&
                (
                    <div className='flex items-center gap-4 flex-1 justify-center'>
                        <div onClick={() => {
                                handleProblemChange(false)
                            }} className={`flex items-center justify-center rounded bg-dark-fill-3 ${order === 1 ? '' : 'hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'}`} >
                            {order === 1 ? "" : <FaChevronLeft />}
                        </div>
                        <Link href='/' className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'>
                            <div>
                                <BsList />
                            </div>
                            <p>Problem List</p>
                        </Link>
                        <div onClick={() => handleProblemChange(true)} className={`flex items-center justify-center rounded bg-dark-fill-3 ${order === totalNumberOfProblems ? '' : 'hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'}`}>
                            {order === totalNumberOfProblems ? "" : <FaChevronRight />}
                        </div>
                    </div>
                )
            }

            <div className='flex items-center space-x-4 flex-1 justify-end'>
                <div>
                    <a
                        href='https://www.buymeacoffee.com/burakorkmezz'
                        target='_blank'
                        rel='noreferrer'
                        className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2'
                    >
                        Premium
                    </a>
                </div>
                {!user &&
                    (
                        <Link href='/auth'>
                            <button onClick={() => {
                                setAuthModalState((prev) => {
                                    return { ...prev, isOpen: true, type: 'login' }
                                })
                            }} className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
                        </Link>
                    )
                }
                {user && problemPage && (
                    <Timer />
                )}
                {user &&
                    (
                        <div className='cursor-pointer group relative'>
                            <img src='/avatar.png' className='h-8 w-8 rounded-full' />

                            <div
                                className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 
		                        transition-all duration-300 ease-in-out'
                            >
                                <p className='text-sm'>{user.email}</p>
                            </div>
                        </div>
                    )
                }
                {user && <Logout />}
            </div>
        </div>
    </nav>
}

export default Topbar;