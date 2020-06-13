
import React ,  {Component} from 'react';

//cmp
import Search from './search-cmp';
import PokemonDetailModal from '../modal/pokemon-modal';
import LISTOPONENTS from './list-oponents/list-oponents-cmp';
import BATTLE_ARENA from './arena/battle-arena-cmp';
//import Paginator from './pagination';
import { itemsByPage , urlAnimated , urlNormal} from '../../share';
import { fetchPokemonData } from '../../services/fetchPokemonData';

//styles
import './style.css';

//animations
import {Animated} from "react-animated-css";

//redux
import {connect} from 'react-redux';
import { addPokemonList } from '../../redux/actions/index';

//stepsprogressbar

import Steps from './stepsProgressBar/steps-cmp';
import BACKFORWARD from './stepsProgressBar/backForward-cmp';

function mapDispatchToProps(dispatch){

    return {
        addPokemonList: pokemonList => dispatch(addPokemonList(pokemonList))
    }
}
const mapStateProps = state => {
    const {pokemonList} = state.pokemons;

    return {
        pokemonList
    }
  }



class List extends Component{

    state = {
        pokemonList : [],
        pokemonListTwo : [],
        allPokemons: 150,
        limit:150,
        offSet:0,
        description:null,
        chain:null,
        listaSeleccionados:0,
        exceedErrorVisible:false,
        stepTwo:false,
        stepOne:true,
        stepThree:false
    }
    showErrorExClass = false;
    styleHover;
    pokemonRandom;

    constructor(props){
        super(props);
       this.handlePokemonSearch = this.handlePokemonSearch.bind(this);
       this.handleModalShow = this.handleModalShow.bind(this);
       this.handleModalHide = this.handleModalHide.bind(this);
        this.handleSelectedPokemon = this.handleSelectedPokemon.bind(this);
    }



    handlePokemonSearch  = (p)=>{
        const pokemonName = p.currentTarget.value.toLowerCase().trim();
       
        let pokemonList=this.state.pokemonListTwo;
        if(pokemonName !== ""){
              pokemonList = this.state.pokemonListTwo.filter(pokemon=>{
                return pokemon.name.includes(pokemonName)
            })
        }
      
        this.setState({
            pokemonList
        })
  
    }


    handleGetPokeByGeneration = (generation)=>{

        this.setState({
            offSet : generation.offset,
            allPokemons : generation.allPokemons,
            limit: generation.limit
        },()=>{
            this.handlePokemonApi(`https://pokeapi.co/api/v2/pokemon/?offset=${this.state.offSet}&limit=${itemsByPage}`);
        });
    }

    componentDidMount(){

       this.handlePokemonApi(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${itemsByPage}`);

    }

     handleModalShow(pokemon){

        this.setState({
            modalShow : true,
            chain:"loading...",
            description: null,
            pokemon
        },()=>{
            this.fetchPokemonDetails()
        })

     }



    async fetchPokemonDetails () {

        const {pokemonNo} = this.state.pokemon;
        let pokeData = fetchPokemonData(pokemonNo);
        pokeData.then(d=>{
            this.setState(d);
        })

    }


    handleModalHide(e){

       this.setState({
            modalShow : false
        })
    }

    handlePokemonApi = (url)=>{
        let pokemonList =[];
        let pokemonListTwo=[];
        this.setState({pokemonList,listFetched:false})

        fetch(url).then(res=>res.json()).then(
           ({results})=>{
                pokemonList = results;
                pokemonListTwo = results;
                this.setState({pokemonList,pokemonListTwo,listFetched:true})
           }
       )
    }

    handleSelectedPokemon = (pokemonSelected)=>{
        
        const isChecked = pokemonSelected.checked;
        
        if(this.state.listaSeleccionados === 6 &&  isChecked){
            this.showErrorMessage();
            return
        }else if(isChecked){
            this.setState(
                (prev,p)=>({listaSeleccionados : prev.listaSeleccionados + 1}),
                ()=>{}
            )
        }else{
            this.setState(
                (prev,p)=>({listaSeleccionados : prev.listaSeleccionados - 1}),
                ()=>{}
               )
        }

            
        this.addPokemonCheckedToMainList(pokemonSelected);
    }   
    

    addPokemonCheckedToMainList=(pokemonSelected)=>{

        const isChecked = pokemonSelected.checked;
    
        this.setState({
            pokemonList : this.state.pokemonList.map(poke=>
                poke.name === pokemonSelected.pokemonName ? {...poke, isChecked}:poke
            ),
            pokemonListTwo : this.state.pokemonListTwo.map(poke=>
                poke.name === pokemonSelected.pokemonName ? {...poke, isChecked}:poke
            )
        },()=>{
            this.toggleNextButton();    
        })
    }

    toggleNextButton=()=>{
        const cantidadSeleccionados = this.state.listaSeleccionados;
        this.setState({
            showNextButton: cantidadSeleccionados === 6
        })
    }

    showErrorMessage=()=>{
        this.setState({
            exceedErrorVisible:true
        })
       setTimeout(()=>{
        this.setState({
            exceedErrorVisible:false
        }) 
       })
       this.showErrorExClass = true;
    }

    getPokemonIndexFromList = (pokemonList,pokemonName)=>{
        const index = pokemonList.findIndex(
            SelectedPoke=>SelectedPoke.pokemonName === pokemonName
        );

        return index;
    }

    getImgsPokemonsSelected = (includeCloseButton)=>{

        let allPokeImgsSelected = [];
        const seleccionados = this.getPokemonsSelectedistObject();

        for(let index=1;index<=6;index++){
            if(typeof seleccionados[index-1]  !== "undefined"){
                
                allPokeImgsSelected.push(
                    this.getPokeImgSelected(index,includeCloseButton)
                );
                continue;
            }
            allPokeImgsSelected.push(
                this.getDefaultImgBall(index)
            )
        }

        return allPokeImgsSelected.map(s=>s);
    }
  
    getPokemonsSelectedistObject(){
        const seleccionados = this.state.pokemonListTwo.length>0 ?
        this.state.pokemonListTwo.filter(poke=>{
            return poke.isChecked
        }):[];

        return seleccionados;
    }
    getPokeImgSelected(index,includeCloseButton){
        
        const seleccionados = this.getPokemonsSelectedistObject();
        const pokemonName = seleccionados[index-1].name;
        return (
            <div key={index} className='containerPokeChoose'>
                    <img alt="" className='styleImgPokeChoose' key={index} 
                    src={`${urlNormal}${pokemonName}.png`}></img>
                    <label                   
                    onClick={()=>this.handleSelectedPokemon({
                        pokemonName,
                        checked:false
                    })}className='styleXChoose'>
                        <span 
                        className={includeCloseButton?"showContainer":"hideContainer"}>X
                        </span>
                    </label> 
            </div>    
        )
    }
    getDefaultImgBall=(index)=>{
        return (
            <div key={index} className='containerPokeChoose'>
                <img alt="" key={index} className='styleBallChooseTwo' src={require('../../img/pokeball.png')}></img>
            </div>
        )
    }
    
    filterPokemonByNo = (thispokemon)=>{

        const pokemonNo = this.getPokemonNo(thispokemon);
        const isPokemonOfGeneration = pokemonNo <= this.state.limit;
        return isPokemonOfGeneration;
    }
    getPokemonNo = (thispokemon)=>{
        const pokemonNo = thispokemon.url.split("/")[6];
        thispokemon["pokemonNo"] = parseInt(pokemonNo);
        return pokemonNo;   
    }

    getPokemonList=()=>{
        let pokemonListContainer =  this.state.pokemonList.filter(p=>this.filterPokemonByNo(p))
        .map((thispokemon,index)=>{
            const isChecked = this.state.pokemonList[index].isChecked || false;
            return (
                <PokemonItem 
                key={index}
                selectPokemon={(pokemonSelected)=>this.handleSelectedPokemon(pokemonSelected)} 
                isChecked = {isChecked}
                pokemonIn = {thispokemon}>
                </PokemonItem> 
                )
        })
        return pokemonListContainer;
    }

    handleChangeViewBySteps =(btn)=>{

            if(btn ==='next' && this.state.stepTwo){
                return;
            }else if(btn==='play'){
                this.setState({
                    play: true,
                    pokemonsNamesRandom: this.pokemonRandom,
                    pokemonSelectedListOfNames: this.getPokemonsSelectedistObject()
                });
                return;
            }

            this.setState(
                (previous,p)=>({
                    stepTwo: !previous.stepTwo,
                    play:false,
                    stepOne: !previous.stepOne
                })
            );
      
    }  
    setPokemonRandom(pokemonRandom){
        this.pokemonRandom = pokemonRandom;
    }
    render(){

        let pokemonList;
       
        if(this.state.listFetched){
             pokemonList = this.getPokemonList();
        }

        const showCloseButton = true;
            return(
            <>
                <div className='sticky-nav'>
                    <Search onChange={this.handlePokemonSearch}/>
                    <Steps state={this.state}></Steps>
                    <Animated 
                        animationInDuration={1000}
                        animationIn="bounceInDown" 
                        isVisible={this.state.stepTwo}>
                            <div className='containerOponentChoosen'>
                                
                            </div>
                    </Animated>
                    <Animated 
                        animationInDuration={1000}
                        animationIn="bounceInDown" 
                        isVisible={!this.state.stepTwo}>
                        <div className={
                            !this.state.stepTwo?'containerPokemonsChoosen':
                            'hideContainer'
                        }>
                            {this.getImgsPokemonsSelected(showCloseButton)}
                            <img alt="" className=
                            {this.state.showNextButton?'showChooseSuccess':'hideChooseSuccess'} 
                            src={require('../../img/chooseSuccess.png')}></img>
                        
                            <Animated 
                            animationOutDuration={7000}
                            animationOut="fadeOut" isVisible={this.state.exceedErrorVisible}>
                                <div 
                                    className={this.showErrorExClass
                                    ?'showErrorMessage':'hideContainer'}>
                                    <label>Puedes escoger solo 6 pokemon!</label>
                                </div>
                            </Animated>     
                        </div>
                    </Animated>
                </div>
                    <div className={!this.state.stepTwo?
                        'containerPokemon':'hideContainer'}>
                        <Animated 
                        animationInDuration={2500}
                        animationIn="slideInLeft" 
                        isVisible={true}>
                                {pokemonList}
                        </Animated>
                    </div>
                <div className='containerPokemon'>
                    <LISTOPONENTS 
                     state={this.state}
                     pokemonSelected ={this.getImgsPokemonsSelected(false)}
                     pokemonRandom = {(pokemonRandom)=>this.setPokemonRandom(pokemonRandom)}
                     >                         
                    </LISTOPONENTS>

                    <BATTLE_ARENA
                    state={this.state}>
                    </BATTLE_ARENA>
                </div>
                    
                <BACKFORWARD 
                changeView={(btn)=>this.handleChangeViewBySteps(btn)} 
                steps={this.state}></BACKFORWARD>
                  
                <PokemonDetailModal
                chain = {this.state.chain}
                description = {this.state.description}
                types = {this.state.types}
                show={this.state.modalShow}
                onHide={()=>this.handleModalHide()} />
            </>
        )

    }
}




const PokemonList = connect(
    mapStateProps,
    mapDispatchToProps
)(List);



class PokemonItem extends Component{

    constructor(props){
       super(props)

       const pokemonName = this.props.pokemonIn.name;
       const url=`${urlNormal}${pokemonName}.png`;
        this.state = {
            hover: false,
            url,
        };
    }
    pokemonSelected;

    render(){

        let pokemonName = this.props.pokemonIn.name;

        const  setStyleHover = {
            transform:`scale( ${this.state.hover?1.2:1} )`,
            transition: 'all .3s ease-in-out',
            width:'150px',
            height:'120px',
            cursor: 'pointer'
         }

         const onHoverPokemon = ()=>{
            const url=`${urlAnimated}${pokemonName}.gif`;
            this.setState({ hover: true,url });
         }
         const onOutPokemon = ()=>{
            const url=`${urlNormal}${pokemonName}.png`;
            this.setState({ hover: false,url })
         }
         const selectPokemon =(pokemonName,checked)=>{
           this.props.selectPokemon({pokemonName,checked:!checked});
         }

        return (
            
            <>
     
             <div className='itemPokemon'
                 style={ setStyleHover }
                 onMouseOver={ () => onHoverPokemon() }
                 onMouseOut={ () => onOutPokemon() } >
                <div  className="checkbox custom">
                 <input 
                 onChange={()=>{}}
                  onClick={()=>selectPokemon(pokemonName,this.props.isChecked)}
                    checked={this.props.isChecked}
                   id={pokemonName} className="css-checkbox" type="checkbox" />
                 <label htmlFor={pokemonName} className="css-label-red"></label> 
                </div>
                 <img alt='' 
                 className={this.props.isChecked?"stylePokemonChecked":"stylePokemonImg"} 
                 src={ this.state.hover?this.state.url : `${urlNormal}${pokemonName}.png` }>
                 </img>
             </div>
            
            </>
        )
            
         
            
           
            
           
        
    }
}

export default PokemonList;