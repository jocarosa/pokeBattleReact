import React from 'react';
import styled, { keyframes } from 'styled-components';
import { bounceInRight } from 'react-animations';

let NEXT = styled.div`
  animation: 1s  ${keyframes `${bounceInRight}`}
`

let PREVIOUS = styled.div`
  animation: 1s  ${keyframes `${bounceInRight}`}
`
let PLAY = styled.div`
  animation: 1s  ${keyframes `${bounceInRight}`}
`

const showNextButton=({steps})=>{
    
    let stateButton = 'hideButton';
    if(steps.showNextButton){
         stateButton = 'showButton';
    }
    if(steps.stepTwo){
        stateButton ='hideButton';
    }
    return stateButton;
}

const BACKFORWARD =(props)=>{
        
    return (
        
        <div className='styleBackForward'>
              <div className={props.steps.stepTwo?"showButton":"hideButton"}>
                <PREVIOUS>
                    <div onClick={()=>props.changeView(null)} className='previousContainer'>
                    <img alt="" className='styleArrowImg' src={require('../../../img/previous_arrow.png')}></img>
                        Previous 
                    </div>
                </PREVIOUS> 
             </div>  
             
            <div  className={showNextButton(props)}>
                <NEXT>
                    <div onClick={()=>props.changeView('next')} className='nextContainer'>
                        Next
                    <img alt="" className='styleArrowImg' src={require('../../../img/next_arrow.png')}></img>
                    </div>
                </NEXT>
            </div>

            <div className={props.steps.stepTwo && !props.steps.play?"showButton":"hideButton"}>
                <PLAY>
                    <div onClick={()=>props.changeView('play')} className='nextContainer'>
                    <img alt="" className='styleArrowImg' src={require('../../../img/next_arrow.png')}></img>
                        Play 
                    </div>
                </PLAY> 
             </div>  
        </div>
        
    )


} 


export default BACKFORWARD;