import React  from 'react';
import {Animated} from "react-animated-css";
import './style.css';
import { urlNormal} from '../../../share';


const getRandomPokemons =(pokemonList)=>{
    let randomPokemons = [];
    if(pokemonList.length>0){
        for(let i=0;i<6;i++){
            
            let index = Math.floor (Math.random()*150);
             randomPokemons.push(pokemonList[index]["name"]);
                    
        }
        return randomPokemons;
    }
    return "";
    
   
}

function LISTOPONENTS(props){
    
    let imgsRamdomPokemons;
    if(props.state.stepTwo){
        
        let pokemonsRandoms;
        
        if(props.state.play){
            pokemonsRandoms =  props.state.pokemonsNamesRandom;
        }else{
            pokemonsRandoms =  getRandomPokemons(props.state.pokemonListTwo);
        }         
  
        if(pokemonsRandoms!==""){
           imgsRamdomPokemons = pokemonsRandoms.map(pokeName=>{
              return <img alt="" src={`${urlNormal}${pokeName}.png`} 
                      key={pokeName} 
                      className='styleComImg'>
                     </img>
          });

          props.pokemonRandom(pokemonsRandoms);

         
        }

    }
 
  

    return (
        <>
            <div>
                <div className={props.state.stepTwo?'versusright':'hideContainer'} >
                    <Animated 
                        animationInDuration={2500}
                        animationIn="slideInRight" >
                        <img alt="" src={require('../../../img/versusright.png')}></img>
                    </Animated>
                </div>
                <div className={props.state.stepTwo?'versusleft':'hideContainer'} >
                    <Animated 
                        animationInDuration={2500}
                        animationIn="slideInLeft" >
                        <img alt="" src={require('../../../img/versusleft.png')}></img>
                    </Animated>
                </div>
                <img alt="" className=''></img>
                
                <div className={props.state.stepTwo ? 'containerOponents' : 'hideContainer'}>
                    <Animated
                        animationInDuration={2500}
                        animationIn="slideInLeft"
                        animationOut="fadeOutDown"
                        isVisible={!props.state.play}
                        >
                        <div className='container'>

                            <div className="row">
                                <div className="col">{props.pokemonSelected}</div>
                                <div className="col">
                                    <img alt=""
                                        className='styleVsImg'
                                        src={require('../../../img/vs.jpg')}></img>
                                </div>
                                <div className="col">
                                    <div>COM</div>
                                    <div>
                                        {imgsRamdomPokemons}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Animated>
                </div>
            </div>
        </>
    )

}


export default LISTOPONENTS;