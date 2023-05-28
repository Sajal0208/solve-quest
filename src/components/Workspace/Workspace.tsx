import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';


const Workspace = () => {
    return (
        <Split className='split'>
            <ProblemDescription />
            <div>Code Editor</div>
        </Split>
    )
}
export default Workspace;