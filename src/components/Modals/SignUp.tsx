import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

type SignUpProps = {
    
};

const SignUp:React.FC<SignUpProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const handleClick = () => {
        setAuthModalState((prevState) => {
            return {
                ...prevState,
                type: 'login'
            }
        })
    }
    const [userInput, setUserInput] = React.useState({
        email: '',
        displayName: '',
        password: ''
    })
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const router = useRouter();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })

    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!userInput.email || !userInput.displayName || !userInput.password) return alert('Please fill all the fields')
        try {
            const newUser = await createUserWithEmailAndPassword(userInput.email, userInput.password)
            if(!newUser) return;
            router.push('/')
        } catch (error: any) {
            console.log(error.message)
        }
    }
    
    useEffect(() => {
        if(error) alert(error.message)
    }, [error])



    return <form onSubmit = {handleRegister} className='space-y-6 px-6 pb-4'>
    <h3 className="text-xl font-medium text-white">Register to solve-quest</h3>
    <div>
        <label htmlFor="email" className="text-sm font-medium block mb-2">
            Email
        </label>
        <input
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue0500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="name@company.com"
        />
    </div>
    <div>
        <label htmlFor="displayName" className="text-sm font-medium block mb-2">
            Display Name
        </label>
        <input
            onChange={handleChange}
            type="displayName"
            name="displayName"
            id="displayName"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue0500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="John Doe"
        />
    </div>
    <div>
        <label htmlFor="password" className="text-sm font-medium block mb-2">
            Password
        </label>
        <input
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue0500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="********"
        />
    </div>

    <button type='submit' className='w-full text-white focus:ring-blue-300
    font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'>
        {loading ? 'Registering...' : 'Register'}
    </button>
    <div className='text-sm font-medium text-gray-300'>
        Already have an account?{" "} <a onClick = {handleClick} href="#" className='text-blue-700 hover:underline'>Log In</a>
    </div>
</form>
}


export default SignUp;