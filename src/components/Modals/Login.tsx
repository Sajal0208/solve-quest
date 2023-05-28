import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const router = useRouter();
    const handleClick = (type: "login" | "register" | "forgotPassword") => {
        setAuthModalState((prevState) => {
            return {
                ...prevState,
                type
            }
        })
    }
    const [userInput, setUserInput] = React.useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!userInput.email || !userInput.password) return alert('Please fill all the fields');
        try {
            const user = await signInWithEmailAndPassword(userInput.email, userInput.password);
            if(!user) return;
            router.push('/')
        } catch(e: any) {
            toast.error(e.message , {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark'
            });
        }
    }

    useEffect(() => {
        if(error) {
            toast.error(error.message , {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark'
            });
        }
    }, [error])


    return <form onSubmit={handleLogin} className='space-y-6 px-6 pb-4'>
        <h3 className="text-xl font-medium text-white">Sign In to solve-quest</h3>
        <div>
            <label htmlFor="email" className="text-sm font-medium block mb-2">
                Your Email
            </label>
            <input
                type="email"
                name="email"
                id="email"
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue0500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                placeholder="name@company.com"
                onChange={handleInputChange}
            />
        </div>
        <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2">
                Your Password
            </label>
            <input
                type="password"
                name="password"
                id="password"
                className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue0500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                placeholder="********"
                onChange={handleInputChange}
            />
        </div>

        <button type='submit' className='w-full text-white focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'>
            {loading ? 'Logging In...' : 'Log In'}
        </button>
        <button onClick={() => handleClick('forgotPassword')} className='flex w-full justify-end'>
            <a href="#" className='text-sm block text-brand-orange hover:underline w-full text-right'>
                Forgot Password?
            </a>
        </button>
        <div className='text-sm font-medium text-gray-300'>
            Not Registered?{" "} <a onClick={() => handleClick('register')} href="#" className='text-blue-700 hover:underline'>Create an account</a>
        </div>
    </form>
}
export default Login;