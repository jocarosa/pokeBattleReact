import React from 'react';
import {Animated} from "react-animated-css";
import './style.css';

const getList=()=>{
    let listOponents = "hello lista oponents";
    return listOponents;

}

function LISTOPONENTS(props){
    return (
        <>
         <div  className={props.stepTwo?'containerOponents':'hideContainer'}>
            <Animated 
                animationInDuration={2500}
                animationIn="slideInLeft" 
                isVisible={true}>
                    hello this from oponent
            </Animated> 
         </div>
        
        
        
        
        
        
        </>
        

    )

}


export default LISTOPONENTS;