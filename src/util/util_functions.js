
import React from 'react';
import { itemsByPage , urlAnimated , urlNormal} from '../share';

//animations
import { Animated } from "react-animated-css";


export function filterPokemonListByName ( pokemonName , state ){

    let pokemonList = state.pokemonListTwo;
    if( pokemonName !== "" ){
          pokemonList = state.pokemonListTwo.filter(pokemon=>{
            return pokemon.name.includes(pokemonName)
        })
    }
   
    return pokemonList;
}


export function  getPokemonNumber  ( thispokemon ) {
    const pokemonNo = thispokemon.url.split("/")[6];
    thispokemon["pokemonNo"] = parseInt(pokemonNo);
    return pokemonNo;   
}

export function  getPokemonsSelectedFromList(pokemonList){

    let seleccionados = [];
    
    if( pokemonList.length > 0 ){
        seleccionados = pokemonList.filter(poke=>{
            return poke.isChecked
        }); 
    }

    return seleccionados;
}

export function setPokemonSelectedToList(pokemonList , pokemonSelected){
 
   const isChecked = pokemonSelected.checked;
   const pokemonSelectedList = pokemonList.map( currentPokemon =>{

        if(currentPokemon.name === pokemonSelected.pokemonName){
            return {...currentPokemon, isChecked}
        }else{
            return currentPokemon;
        }

    });

    return pokemonSelectedList;

}

export function getImgFromPokemonsSelectedList( pokemonList , showCloseButton ){

    let allPokeImgsSelected = [];
    const seleccionados = getPokemonsSelectedFromList( pokemonList );

    for( let index=1;index<=6;index++ ){

        if(typeof seleccionados[index-1]  !== "undefined"){
      
            const pokemonName = seleccionados[index-1].name;

            let img = 

                (<div key={index} className='containerPokeChoose'>
                    <img alt="" className='styleImgPokeChoose' key={index} src={`${urlNormal}${pokemonName}.png`}></img>
                    <label                   
                        onClick = {
                            ()=>this.handleSelectedPokemon({
                            pokemonName,
                            checked:false})
                        } 
                        className='styleXChoose'>
                        <span className={showCloseButton?"showContainer":"hideContainer"}>X</span>
                    </label> 
                </div>   ) 


           allPokeImgsSelected.push(img);
          continue;                 
       }   

       allPokeImgsSelected.push(getDefaultPokeBallImg(index));
    
    }            
        
    return allPokeImgsSelected.map(s=>s);
    
}



export function getDefaultPokeBallImg(index){
        
        return (
            <div key={index} className='containerPokeChoose'>
                <img alt="" key={index} className='styleBallChooseTwo' src={require('../img/pokeball.png')}></img>
            </div>
        )    
}



export function getAnimatedComponent(animationInDuration, isVisible, animationType, body){
    return (
        <Animated 
            animationInDuration={2500}
            animationIn="slideInLeft" 
            isVisible={true}>
            {body}
        </Animated>
    )
}