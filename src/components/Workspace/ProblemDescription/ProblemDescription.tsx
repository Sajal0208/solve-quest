import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
	problem: Problem;
	_solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
	const [user] = useAuthState(auth);
	const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problem.id)
	const {
		liked,
		disliked,
		starred,
		solved,
		setData
	} = useGetUserDataOnProblem(problem.id)
	const [updating, setUpdating] = useState(false)

	const handleLike = async () => {
		if (!user) {
			return toast.error('Please login to like the problem', { position: 'top-left' })
		}
		if (updating) return
		setUpdating(true)
		const body = {
			uid: user?.uid,
		}
		console.log(problem)
		const url = `${process.env.NEXT_PUBLIC_BASEURL}/problem/handleLike/${problem.id}`
		const response = await axios.put(url, body)
		setCurrentProblem(response.data.problem)
		setData({
			liked: response.data.user.likedProblems.includes(problem.id), // will return true or false
			disliked: response.data.user.dislikedProblems.includes(problem.id),
			starred: response.data.user.starredProblems.includes(problem.id),
			solved: response.data.user.solvedProblems.includes(problem.id)
		})
		setUpdating(false)
	}


	const handleDislike = async () => {
		if (!user) {
			return toast.error('Please login to dislike the problem', { position: 'top-left' })
		}
		if (updating) return
		setUpdating(true)
		const body = {
			uid: user?.uid,
		}
		const url = `${process.env.NEXT_PUBLIC_BASEURL}/problem/handleDislike/${problem.id}`
		const response = await axios.put(url, body)
		setCurrentProblem(response.data.problem)
		setData({
			liked: response.data.user.likedProblems.includes(problem.id), // will return true or false
			disliked: response.data.user.dislikedProblems.includes(problem.id),
			starred: response.data.user.starredProblems.includes(problem.id),
			solved: response.data.user.solvedProblems.includes(problem.id)
		})
		setUpdating(false)
	}

	const handleStar = async () => {
		if (!user) {
			return toast.error('Please login to star the problem', { position: 'top-left' })
		}
		if (updating) return
		setUpdating(true)
		const body = {
			uid: user?.uid,
		}
		const url = `${process.env.NEXT_PUBLIC_BASEURL}/problem/handleStar/${problem.id}`
		const response = await axios.put(url, body)
		setCurrentProblem(response.data.problem)
		setData({
			liked: response.data.user.likedProblems.includes(problem.id), // will return true or false
			disliked: response.data.user.dislikedProblems.includes(problem.id),
			starred: response.data.user.starredProblems.includes(problem.id),
			solved: response.data.user.solvedProblems.includes(problem.id)
		})
		setUpdating(false)
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
									{(solved || _solved ) && <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
										<BsCheck2Circle />
									</div>}
									<div onClick={handleLike} className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
										{liked && !updating && <AiFillLike className="text-dark-blue-s" />}
										{!liked && !updating && <AiFillLike />}
										{updating && <AiOutlineLoading3Quarters className="animate-spin" />}

										<span className='text-xs'>{currentProblem.likes}</span>
									</div>
									<div onClick={handleDislike} className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'>
										{disliked && !updating && <AiFillDislike className="text-dark-blue-s" />}
										{!disliked && !updating && <AiFillDislike />}
										{updating && <AiOutlineLoading3Quarters className="animate-spin" />}

										<span className='text-xs'>{currentProblem.dislikes}</span>
									</div>
									<div onClick={handleStar} className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '>
										{starred && !updating && <AiFillStar className="text-dark-yellow" />}
										{!starred && !updating && <TiStarOutline />}
										{updating && <AiOutlineLoading3Quarters className="animate-spin" />}
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
			console.log("🚀 ~ file: ProblemDescription.tsx:173 ~ getCurrentProblem ~ response:", response.data)
			const problem = response.data._doc
			setCurrentProblem({
				...problem,
			})
			setProblemDifficultyClass(
				problem.difficulty === "Easy" ? "bg-olive text-olive" :
					problem.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" :
						"bg-dark-pink text-dark-pink"
			)
			setLoading(false)
		}
		getCurrentProblem()
	}, [problemId])

	return { currentProblem, loading, problemDifficultyClass, setCurrentProblem }
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
			console.log("🚀 ~ file: ProblemDescription.tsx:210 ~ getUsersData ~ userData:", userData)
			if (!userData) {
				throw new Error("User not found")
			}
			const { likedProblems, dislikedProblems, starredProblems, solvedProblems } = userData.data._doc
			console.log("🚀 ~ file: ProblemDescription.tsx:268 ~ getUsersData ~ userData.data._doc:", userData.data._doc)
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