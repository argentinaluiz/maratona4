// @flow 
import * as React from 'react';
import { LeftSide } from './LeftSide';
type Props = {
    
};
export const AuthLayout1:React.FC<Props> = (props) => {
    return (
        <>
        {/* <div className='content'>
            <LeftSide/>
            </div> */}
            {props.children}
        </>
    );
};