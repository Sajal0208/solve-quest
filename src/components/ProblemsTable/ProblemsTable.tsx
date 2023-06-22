"use client"
import React, { useState, useEffect } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { AiFillYoutube } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import YouTube from 'react-youtube';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import { DBProblem } from '@/utils/types/problem';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';

type ProblemsTableProps = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoading }) => {
    const [youtubePlayer, setYoutubePlayer] = useState({
        isOpen: false,
        videoId: ""
    });

    const problems = useGetProblems(setLoading);
    const solvedProblems = useGetSolvedProblems();

    const closeModal = () => {
        setYoutubePlayer({
            isOpen: false,
            videoId: ""
        })
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal()
        }
        window.addEventListener('keydown', handleEsc)
    }, [])

    return (
        <>
            <tbody className="text-white">
                {problems.map((problem, idx) => {
                    console.log(problem)
                    const difficultyColor = problem.difficulty === "Easy" ? "text-dark-green-s" : problem.difficulty === "Medium" ? "text-dark-yellow" : "text-dark-pink";
                    return (
                        <tr className={`${idx % 2 == 1 ? "bg-dark-layer-1" : ""}`} key={problem.id}>
                            <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                                {solvedProblems.includes(problem.id) && <BsCheckCircle fontSize={'18'} width='18' />}
                            </th>
                            <td className='px-6 py-4'>
                                <Link className='hover:text-blue-600 cursor-pointer' href={`/problems/${problem.id}`}>
                                    {problem.title}
                                </Link>
                            </td>
                            <td className={`px-6 py-4 ${difficultyColor}`}>{problem.difficulty}</td>
                            <td className="px-6 py-4">{problem.category}</td>
                            <td className="px-6 py-4">
                                {problem.videoId ? (
                                    <AiFillYoutube onClick={() => {
                                        setYoutubePlayer({
                                            isOpen: true,
                                            videoId: problem.videoId as string
                                        })
                                    }} fontSize={"28"} className='cursor-pointer hover:text-red-600' />
                                ) : (
                                    <p className='text-gray-400'>Coming Soon</p>
                                )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            {youtubePlayer.isOpen &&
                (
                    <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center' >
                        <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute' onClick={closeModal}></div>
                        <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                            <div className='w-full h-full flex items-center justify-center relative'>
                                <div className='w-full relative'>
                                    <IoClose onClick={closeModal} fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' />
                                    <YouTube videoId={youtubePlayer.videoId} loading='lazy' iframeClassName='w-full min-h-[500px]' />
                                </div>
                            </div>
                        </div>
                    </tfoot>
                )}
        </>
    )
}
export default ProblemsTable;

function useGetProblems(setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    const [problems, setProblems] = useState<DBProblem[]>([]);
    useEffect(() => {
        // fetching data logic
        const getProblems = async () => {
            setLoading(true);
            const tempArray: DBProblem[] = [];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/problem/getProblems`);
            response.data.problems.forEach((problem: any) => {
                tempArray.push({
                    ...problem,
                    id: problem.problem_id
                } as DBProblem);
            });
            // tempArray.push(...response.data.problems);
            tempArray.sort((a, b) => a.order - b.order);
            setProblems(tempArray);
            setLoading(false);
        }
        getProblems();
    }, [setLoading]);
    return problems;
}

function useGetSolvedProblems() {
    const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const getSolvedProblems = async () => {
            const url = `${process.env.NEXT_PUBLIC_BASEURL}/user/getUser/${user?.uid}`
            const response = await axios.get(url);
            const solvedProblems = response.data._doc.solvedProblems;
            setSolvedProblems(solvedProblems);
        }
        if (user) {
            getSolvedProblems();
        }
        if(!user) {
            setSolvedProblems([]);
        }

    }, [user])

    return solvedProblems;
}