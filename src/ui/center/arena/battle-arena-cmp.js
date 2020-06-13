import React , { useState }from 'react';
import './style.css';
import { urlAnimated , urlNormal , urlBackAnimated} from '../../../share.js';
import { Modal } from 'react-bootstrap';

export default function BattleArena(props){

    const [state, setState] = useState(
        {
            porcentageOfDamage : 100,
            animateThisMove : "",
            pokemonFighting: null 
        }
    );

    let arena="";
    if(props.state.play){    

        const listOfPokemons = props.state.pokemonSelectedListOfNames;
        const  firstPokemonRandom = props.state.pokemonsNamesRandom[0];
        const pokemonFighting = state.pokemonFighting === null?
        listOfPokemons[0]["name"]:state.pokemonFighting;

        
        const pokemonToChoose = 
        (state.hasOwnProperty("index"))?listOfPokemons[state.index]["name"]:"";

        arena = <>
                    <div className="pokemonsSelected">
                        {getImgPokemonSelected(props.state.pokemonSelectedListOfNames)}
                    </div>
                    <div className="containerArena">
                        <div className="containerPokeEnemy">
                            <div className="containerEnemyState">
                                <label>{firstPokemonRandom}</label>
                                <label> Lv 10</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width:  `${state.porcentageOfDamage}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <img src={`${urlAnimated}${firstPokemonRandom}.gif`}/>
                        </div>
                        <div className="containerEffect">
                            <img className={state.animateThisMove===""?"hideContainer":"styleMoveImg"} 
                            src={state.animateThisMove===""?"":require(`../../../img/moves/${state.animateThisMove}.gif`)}/> 
                        </div>
                        <div className="containerMyPokemon">
                            <img src={`${urlBackAnimated}${pokemonFighting}.gif`}/>
                            <div className="containerMyState">
                                <label>{pokemonFighting}</label>
                                <label> Lv 10</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: "100%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                        <div className="containerMoves">
                            <div>
                                <div onClick={()=>attack(0,'scratch')} className="move">
                                    Scratch
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pokemonsRandom">
                        {getImgPokemonSelected(props.state.pokemonsNamesRandom)}
                    </div>


                    <Modal
                        show={state.modalShow}
                        backdrop="static"
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        className="my-modal">
                            <Modal.Body>
                                <div>
                                     <img className="styleImgModal" src={`${urlAnimated}${pokemonToChoose}.gif`}/>
                                </div>
                                <div className="containerBtnAttack">
                                    <div onClick={()=>chooseThisPokemonToFight()} 
                                    className={state.pokemonToChoose?"activeBtnChoose":"inactiveBtnChoose"}>
                                            Choose {pokemonToChoose} 
                                    </div>  
                                    <div onClick={()=>setState({...state,modalShow:false})}>
                                        Cancel
                                    </div>
                                </div>
                            </Modal.Body>
                    </Modal>
     
                </>
    }

    return (
        <>
        
        <div className="arena">
            {arena}
        </div>
        
        </>
    )

    function attack(pokemonIndex,move){
        setState({
            ...state,
            animateThisMove : move
        });

        setTimeout(()=>{
            setState({
                ...state,
                animateThisMove : "",
                porcentageOfDamage:25

            });
        },2000);
         
    }

    function getImgPokemonSelected(pokemonList){

        if(pokemonList !=null){
    
            if(!pokemonList[0].hasOwnProperty("name")){
               return (
                pokemonList.map( 
                    pokemon => 
                        <div>
                            <img src={`${urlNormal}${pokemon}.png`}/>
                        </div>
                )
               )     
            }

            let pokemonFighting = state.pokemonFighting === null?
            props.state.pokemonSelectedListOfNames[0]["name"]:state.pokemonFighting;

            return  (
               
                pokemonList.map( 
                            (pokemon,index) => 
                                <div>
                                    <img className={(pokemonFighting === pokemon.name)?
                                    "activeFigther":"inactive"
                                    }
                                    onClick={()=>askToChooseThisPokemon(index)} 
                                    src={`${urlNormal}${pokemon.name}.png`}/>
                                </div>
                        )
                    );
        }
        
    }

    function chooseThisPokemonToFight(){
        
        
        const listOfPokemons = props.state.pokemonSelectedListOfNames;
        const pokemonToChoose = listOfPokemons[state.index]["name"];
        setState({
            ...state,
            pokemonFighting : pokemonToChoose,
            modalShow :false
        });

        
    }
    

    function askToChooseThisPokemon(index){
        
        setState({
            ...state,
            pokemonToChoose : true,
            modalShow :true,
            index
        });
    }
}