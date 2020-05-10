import React,{Component}  from 'react';
import './steps.css';


class Steps extends Component{

    constructor(props){
        super(props);

    }

   render(){
        return(
            <div className='containerProgressBar'>
                <ul className="progressbar">
                    <li className={this.props.state.stepOne?'active':''} >Choose 6 pokemons</li>
                    <li className={this.props.state.stepTwo?'active':''}>Search Oponent</li>
                    <li className={this.props.state.stepThree?'active':''}>Start Battle!</li>
                </ul>
            </div>
        )

   }
}


export default Steps;
