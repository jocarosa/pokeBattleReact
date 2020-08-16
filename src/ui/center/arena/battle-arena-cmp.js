import React , { useState }from 'react';
import './style.css';
import { urlAnimated , urlNormal , urlBackAnimated} from '../../../share.js';
import { Modal } from 'react-bootstrap';

export default function BattleArena(props){

    let containerArena = null;

    const [state, setState] = useState(
        {
            porcentageOfDamage : 100,
            animateThisMove : "",
            pokemonFighting: null 
        }
    );
    
    if(props.state.play){    

        containerArena = getContainerArena();
        
    }

    return (
        <>
            <div className="arena">
                {containerArena}
            </div>
        </>
    )

    function getContainerArena(){
        
        let containerArena = 
        <>
            <div className="pokemonsSelected">
                {getImgOfPokemonSelectedFromList(props.state.pokemonSelectedListOfNames)}
            </div>

            {getPokemonArena()}

            <div className="pokemonsRandom">
                {getImgOfPokemonSelectedFromList(props.state.pokemonsNamesRandom)}
            </div>
            
            {getModalToChoosePokemon()}
        </>

        return containerArena;

    }

    function getPokemonArena(){

        return ( 
        
        <div className="containerArena">
            {getContainerOfPokemonEnemy()}      
            <div className="containerEffect">
                <img className={state.animateThisMove===""?"hideContainer":"styleMoveImg"} 
                src={state.animateThisMove===""?"":require(`../../../img/moves/${state.animateThisMove}.gif`)}/> 
            </div>
            {getContainerOfMyPokemon()}
            {getContainerOfMoves()}
        </div> 
        
        )
    }

    function getContainerOfPokemonEnemy(){

        const  firstPokemonRandom = props.state.pokemonsNamesRandom[0];

        return (
        <div className="containerPokeEnemy">
            <div className="containerEnemyState">
                <label>{firstPokemonRandom}</label>
                <label> Lv 10</label>
                <div className="progress">
                    <div className="progress-bar" role="progressbar" 
                    style={{width:  `${state.porcentageOfDamage}%`}} 
                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <img src={`${urlAnimated}${firstPokemonRandom}.gif`}/>
        </div>
        )
    }

    function getContainerOfMyPokemon(){

        const pokemonFighting = getPokemonFighting();
    
        return (
            <div className="containerMyPokemon">
                {getImgFromPokemonFighting(pokemonFighting)}
                <div className="containerMyState">
                    <label>{pokemonFighting}</label>
                    <label> Lv 10</label>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" 
                            style={{width: "100%"}} 
                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function getContainerOfMoves(){
        return(
            <div className="containerMoves">
                <div>
                    <div onClick={()=>attack(0,'scratch')} className="move">
                        Scratch
                    </div>
                </div>
            </div>
        )
    }

    function getModalToChoosePokemon(){

        const pokemonToChoose = getPokemonToChoose();

        return (<Modal
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
                    <div onClick={()=>choosePokemon()} 
                    className={state.pokemonToChoose?"activeBtnChoose":"inactiveBtnChoose"}>
                            Choose {pokemonToChoose} 
                    </div>  
                    <div onClick={()=>setState({...state,modalShow:false})}>
                        Cancel
                    </div>
                </div>
            </Modal.Body>
        </Modal>)
    }

    function choosePokemon(){

        const listOfPokemons = props.state.pokemonSelectedListOfNames;
        const pokemonToChoose = listOfPokemons[state.index]["name"];
        
            //animate get back
        animatePokemonChange(true);
        //animate gopokemon
        setTimeout(()=>{
            animatePokemonChange(false);
        },1000);

        //change pokemon
        setTimeout(()=>{
            setState({
                ...state,
                pokemonFighting : pokemonToChoose,
                modalShow :false
            });
        },2000);
        
    }

    function getPokemonToChoose(){

        let pokemonToChoose = "";
        const listOfPokemons = props.state.pokemonSelectedListOfNames;
            
        if(state.hasOwnProperty("index")){
            pokemonToChoose = listOfPokemons[state.index]["name"];
        }
        return pokemonToChoose;
    }

    function getPokemonFighting(){

        let pokemonFighting = null;
        const listOfPokemons = props.state.pokemonSelectedListOfNames;
        
        if(state.pokemonFighting === null){
            pokemonFighting = listOfPokemons[0]["name"];
        }else{
            pokemonFighting = state.pokemonFighting;
        }

        return pokemonFighting;
    }

    function getImgFromPokemonFighting(pokemonFighting){

        if(state.hasOwnProperty("lanzarPokemon") && state.lanzarPokemon){
            return (
                <img src={require(`../../../img/goPokemon.gif`)}/>
            )
        }else if(state.hasOwnProperty("getBackPokemon") && state.getBackPokemon){
            return (
                <img src={require(`../../../img/comeback.gif`)}/>
            )
        }else{
            return (
                <img src={`${urlBackAnimated}${pokemonFighting}.gif`}/>
            )
        }
    }

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

    function getImgOfPokemonSelectedFromList(pokemonList){

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
 
    function animatePokemonChange(getBackPokemon){
        if(getBackPokemon){
            setState({
                ...state,
                getBackPokemon :true,
                lanzarPokemon :false,
                modalShow :false
            });
        }else{
            setState({
                ...state,
                lanzarPokemon :true,
                getBackPokemon :false,
                modalShow :false
            });
        }
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