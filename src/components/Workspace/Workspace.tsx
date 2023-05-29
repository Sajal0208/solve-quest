import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from '../Playground/Playground';


const Workspace = () => {
    return (
        <Split minSize={0} className='split'>
            <ProblemDescription />
            <Playground />
        </Split>
    )
}
export default Workspace;