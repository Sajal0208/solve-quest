import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { PAGE_SEGMENT_KEY } from "next/dist/shared/lib/constants";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
	problem: Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
	const [user] = useAuthState(auth);
	const { currentProblem, loading, problemDifficultyClass } = useGetCurrentProblem(problem.id)
	const {
		liked,
		disliked,
		starred,
		solved 
	} = useGetUserDataOnProblem(problem.id)
	const [updating, setUpdating] = useState(false)

	const handleLike = async () => {
		if(!user) {
			toast.error('Please login to like the problem', {position: 'top-left'})
		}
		
		const body = {
			uid: user?.uid,
			problemId: problem.id
		}

		


	}

	return (
		<div className='bg-dark-layer-1'>
			{/* TAB */}
			<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
				<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5'>
					{/* Problem heading */}
					<div className='w-full'>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
						</div>
						{
							!loading && currentProblem && (
								<div className='flex items-center mt-3'>
									<div
										className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
									>
										{currentProblem.difficulty}
									</div>
									<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
										<BsCheck2Circle />
									</div>
									<div onClick = {handleLike} className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
										{liked ? <AiFillLike className="text-dark-blue-s" /> : <AiFillLike />}
										<span className='text-xs'>{currentProblem.likes}</span>
									</div>
									<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'>
										<AiFillDislike />
										<span className='text-xs'>{currentProblem.dislikes}</span>
									</div>
									<div className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '>
										<TiStarOutline />
									</div>
								</div>
							)
						}

						{
							loading && (
								<div className="mt-3 flex space-x-2">
									<RectangleSkeleton />
									<CircleSkeleton />
									<RectangleSkeleton />
									<RectangleSkeleton />
									<CircleSkeleton />
								</div>
							)
						}

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm'>
							<div
								dangerouslySetInnerHTML={
									{
										__html: problem.problemStatement
									}
								}
							/>
						</div>

						{/* Examples */}
						<div className='mt-4'>
							{/* Example 1 */}
							{problem.examples.map((example, index) => (
								<div key={example.id}>
									<p className='font-medium text-white '>Example {index + 1}: </p>
									{
										example.img && (
											<img src={example.img} alt={"Example Image"} className="mt-3" />
										)
									}
									<div className='example-card'>
										<pre>
											<strong className='text-white'>Input: </strong> {example.inputText}
											<br />
											<strong>Output:</strong> {example.outputText} <br />
											{example.explanation && (
												<>
													<strong>Explanation:</strong>{example.explanation}
												</>
											)}

										</pre>
									</div>
								</div>
							))}
						</div>

						{/* Constraints */}
						<div className='my-8 pb-8'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
								<div
									dangerouslySetInnerHTML={{
										__html: problem.constraints
									}}
								/>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
	const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null)
	const [loading, setLoading] = useState(true)
	const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("")

	useEffect(() => {
		const getCurrentProblem = async () => {
			setLoading(true)
			const url: string = `${process.env.NEXT_PUBLIC_BASEURL}/problem/getProblem/${problemId}`
			const response = await axios.get(url)
			const docRef = doc(firestore, "problems", problemId)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				const problem = docSnap.data() as DBProblem
				setCurrentProblem({
					...problem,
					id: docSnap.id,
				} as DBProblem)
				setProblemDifficultyClass(
					problem.difficulty === "Easy" ? "bg-olive text-olive" :
						problem.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" :
							"bg-dark-pink text-dark-pink"
				)
			}
			setLoading(false)
		}
		getCurrentProblem()
	}, [problemId])

	return { currentProblem, loading, problemDifficultyClass }
}


function useGetUserDataOnProblem(problemId: string) {
	const [data, setData] = useState({
		liked: false,
		disliked: false,
		starred: false,
		solved: false
	})
	const [currentUser] = useAuthState(auth)
	useEffect(() => {
		const getUsersData = async () => {
			const url = `${process.env.NEXT_PUBLIC_BASEURL}/user/getUser/${currentUser?.uid}`
			const config = {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			}
			const userData = await axios.get(url, config)
			if (!userData) {
				throw new Error("User not found")
			}
			const { likedProblems, dislikedProblems, starredProblems, solvedProblems } = userData.data._doc
			setData({
				liked: likedProblems.includes(problemId), // will return true or false
				disliked: dislikedProblems.includes(problemId),
				starred: starredProblems.includes(problemId),
				solved: solvedProblems.includes(problemId)
			})
		}
		if (currentUser) {
			getUsersData()
		}

		return () => setData({
			liked: false,
			disliked: false,
			starred: false,
			solved: false
		})
	}, [problemId, currentUser])
	return {
		...data,
		setData
	}
}