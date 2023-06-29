import Image from 'next/image'
import Navbar from '@/components/Navbar/Navbar'
import Topbar from '@/components/Topbar/Topbar'
import { doc, setDoc } from 'firebase/firestore'
import ProblemsTable from '@/components/ProblemsTable/ProblemsTable'
import { useState } from 'react'
import { problems } from '@/mockProblems/problems'
import { firestore } from '@/firebase/firebase'
import axios from 'axios'
import useHasMounted from '@/hooks/useHasMounted'

export default function Home() {

  const [loading, setLoading] = useState(true);
  const hasMounted = useHasMounted(); 

  if(!hasMounted) return null

  return (
    <div className="bg-dark-layer-2 min-h-screen">
      <Topbar />
      <h1
        className='text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5'>
        &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
      </h1>

      <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
        {loading && (
          <div className='max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse'>
            {[...Array(10)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}
        <table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
          {
            !loading && (
              <thead className='text-xs text-gray-700 uppercase dark:text-gray-400 border-b '>
                <tr>
                  <th scope='col' className='px-1 py-3 w-0 font-medium'>
                    Status
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Title
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Difficulty
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Category
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Solution
                  </th>
                </tr>
              </thead>
            )
          }
          <ProblemsTable setLoading={setLoading} />
        </table>
      </div>
      
    </div>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className='flex items-center space-x-12 mt-4 px-6'>
      <div className='w-6 h-6 shrink-0 rounded-full bg-dark-layer-1'></div>
      <div className='h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1'></div>
      <div className='h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1'></div>
      <div className='h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1'></div>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};


  // const [input, setInput] = useState({
  //   id: '',
  //   title: '',
  //   difficulty: '',
  //   category: '',
  //   videoId: '',
  //   link: '',
  //   order: 0,
  //   likes: 0,
  //   dislikes: 0,
  // })

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInput((prev) => {
  //     return {
  //       ...prev,
  //       [e.target.name]: e.target.value,
  //     }
  //   })
  // }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const test = problems.map(async (problem, index) => {
  //     if(index === 7) {
  //       const newProblem = {
  //         ...problem,
  //         order: Number(problem.order),
  //         title: `${index + 1}. ${problem.title}`,
  //       }
  //       const status = await axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/problem/addProblem`, newProblem)
  //       return status
  //     }
  //     return null
  //   })
  //   console.log(test)
  // }

  {/* <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} type='text' placeholder='problem id' name='id' />
        <input onChange={handleInputChange} type='text' placeholder='problem title' name='title' />
        <input onChange={handleInputChange} type='text' placeholder='problem difficulty' name='difficulty' />
        <input onChange={handleInputChange} type='text' placeholder='problem category' name='category' />
        <input onChange={handleInputChange} type='text' placeholder='problem category' name='order' />
        <input onChange={handleInputChange} type='text' placeholder='problem videoId' name='videoId' />
        <input onChange={handleInputChange} type='text' placeholder='problem link' name='link' />
        <button className='bg-white'>Start</button>
      </form> */}