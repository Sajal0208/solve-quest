import React, { useEffect } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter';
import { Problem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { problems } from '@/utils/problems';
import axios from 'axios';
import useLocalStorage from '@/hooks/useLocalStorage';

type PlaygroundProps = {
    problem: Problem
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
    setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
    fontSize: string;
    settingsModalIsOpen: boolean;
    dropDownIsOpen: boolean;
};

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
    const [activeTestCaseId, setActiveTestCaseId] = React.useState<number>(0);
    let [userCode, setUserCode] = React.useState<string>('');
    const [fontSize, setFontSize] = useLocalStorage('lcc-fontSize', '16px')
    const [settings,setSettings] = React.useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropDownIsOpen: false,  
    }) 


    const [user] = useAuthState(auth);
    const router = useRouter()
    const { query: { pid } } = router

    const handleSubmit = async () => {
        if (!user) {
            return toast.error('You need to login to submit your code', {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark'
            });
        }

        try {
            userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName))
            const cb = new Function(`return ${userCode}`)();
            const handler = problems[pid as string].handlerFunction

            if (typeof handler === 'function') {
                const success = handler(cb)
                if (success) {
                    toast.success('Your code is correct', {
                        position: 'top-center',
                        autoClose: 3000,
                        theme: 'dark'
                    });
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 4000);
                    const body = {
                        uid: user?.uid,
                    }
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASEURL}/problem/handleSolved/${pid}`, body)
                    if (response?.status === 200) {
                        console.log('save to db')
                    }
                    setSolved(true);
                } else {
                    toast.error('Oops! Your code is incorrect', {
                        position: 'top-center',
                        autoClose: 3000,
                        theme: 'dark'
                    });
                }
            }
        } catch (error: any) {
            if (error.message.startsWith('AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:')) {
                toast.error('Oops! One or more test cases failed', {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark'
                });
            } else {
                toast.error(error.message, {
                    position: 'top-center',
                    autoClose: 3000,
                    theme: 'dark'
                });
            }
        }

    }

    useEffect(() => {
        const code = localStorage.getItem(`code-${pid}`)
        if (user) {
            setUserCode(code ? JSON.parse(code) : problem.starterCode)
        }
        else {
            setUserCode(problem.starterCode)
        }
    }, [pid, user, problem.starterCode])

    const onChange = (value: string) => {
        setUserCode(value)
        localStorage.setItem(`code-${pid}`, JSON.stringify(value))
    }

    return (
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <PreferenceNav settings = {settings} setSettings = {setSettings} />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60} >
                <div className='w-full overflow-auto'>
                    <ReactCodeMirror
                        value={userCode}
                        theme={vscodeDark}
                        onChange={onChange}
                        extensions={[javascript()]}
                        style={{ fontSize: settings.fontSize }}
                    />
                </div>
                <div className='w-full px-5 overflow-auto'>
                    {/* Test Case Heading */}
                    <div className="flex h-10 items-center space-x-6">
                        <div className="relative flex h-full flex-col justify-center cursor-pointer">
                            <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
                        </div>
                    </div>

                    {/* Test Case */}
                    <div className="flex">
                        {problem.examples.map((example, index) => {
                            return (
                                <div className='mr-2 items-start mt-2' key={example.id}
                                    onClick={() => setActiveTestCaseId(index)}
                                >
                                    <div className='flex flex-wrap items-center gap-y-4'>
                                        <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${activeTestCaseId === index ? 'text-white' : 'text-gray-500'}`} >
                                            Case {index + 1}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                    <div className="font-semibold my-4">
                        <p className='text-sm font-medium mt-4'>
                            Input:
                        </p>
                        <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white">
                            {problem.examples[activeTestCaseId].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4'>
                            Output:
                        </p>
                        <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white">
                            {problem.examples[activeTestCaseId].outputText}
                        </div>
                    </div>
                </div>
            </Split>
            <EditorFooter handleSubmit={handleSubmit} />
        </div>
    )
}
export default Playground;