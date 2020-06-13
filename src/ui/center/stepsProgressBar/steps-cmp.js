import React,{Component}  from 'react';
import './steps.css';


class Steps extends Component{

     render(){
        return(
            <div className='containerProgressBar'>
                <ul className="progressbar">
                    <li className={this.props.state.stepOne?'active':''} >Choose 6 pokemons</li>
                    <li className={this.props.state.stepTwo?'active':''}>Search Oponent</li>
                    <li className={this.props.state.play?'active':''}>Start Battle!</li>
                </ul>
            </div>
        )

   }
}


export default Steps;
