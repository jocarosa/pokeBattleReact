import React from 'react';
import styled, { keyframes } from 'styled-components';
import { bounceInRight } from 'react-animations';

let NEXT = styled.div`
  animation: 1s  ${keyframes `${bounceInRight}`}
`

let PREVIOUS = styled.div`
  animation: 1s  ${keyframes `${bounceInRight}`}
`
const BACKFORWARD =(props)=>{
        
    return (
        
        <div className='styleBackForward'>
            {/* <div>
                <PREVIOUS>
                    <img className='styleArrowImg' src={require('../../../img/previous_arrow.png')}></img>
                    Previous 
                </PREVIOUS>
             </div> */}
             
                <div  className={props.steps.showNextButton?"showNext":"hideNext"}>
                <NEXT>
                    <div className='nextContainer'>
                    Next
                    <img className='styleArrowImg' src={require('../../../img/next_arrow.png')}></img>
                    </div>
                    </NEXT>
                </div>
            
          
        </div>
        
    )


} 


export default BACKFORWARD;