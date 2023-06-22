import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from '../Playground/Playground';
import { Problem } from '@/utils/types/problem';
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';

type WorkspaceProps = {
    problem: Problem
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
    const { width, height } = useWindowSize();
    const [success, setSuccess] = React.useState(false);
    const [solved, setSolved] = React.useState(false);
    return (
        <Split minSize={0} className='split'>
            <ProblemDescription _solved = {solved} problem = {problem}/>
        <div className = 'bg-dark-fill-2'>
            <Playground setSolved = {setSolved} setSuccess = {setSuccess} problem = {problem} />
            {success && <Confetti width={width-1} height={height-1} gravity={0.3} tweenDuration={4000} />}
        </div>
        </Split>
    )
}
export default Workspace;