import React,{Component}  from 'react';
import './steps.css';


class Steps extends Component{



   render(){
        return(
            <div className='containerProgressBar'>
                <ul className="progressbar">
                    <li className="active" >Choose 6 pokemons</li>
                    <li >Search Oponent</li>
                    <li>Start Battle!</li>
                </ul>
            </div>
        )

   }
}


export default Steps;
