
import React ,  {Component} from 'react';

//cmp
import Search from './search-cmp';
import PokemonDetailModal from '../modal/pokemon-modal';
import LISTOPONENTS from './list-oponents/list-oponents-cmp';
import BATTLE_ARENA from './arena/battle-arena-cmp';
//import Paginator from './pagination';
import { itemsByPage , urlAnimated , urlNormal} from '../../share';
import { fetchPokemonData, getListOfPokemon } from '../../services/fetchPokemonData';

//util functions
import  * as utilFunction from '../../util/util_functions';
//styles
import './style.css';

//animations
import { Animated } from "react-animated-css";

//redux
import { connect } from 'react-redux';
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
       this.filterPokemonListWhenSearch = this.filterPokemonListWhenSearch.bind(this);
       this.handleModalShow = this.handleModalShow.bind(this);
       this.handleModalHide = this.handleModalHide.bind(this);
       this.handleSelectedPokemon = this.handleSelectedPokemon.bind(this);
    }


    componentDidMount(){
        this.setPokemonListByLimit(0,itemsByPage);
      }

    getPokemonListByGeneration = ( generation )=>{

        this.setState({
            offSet : generation.offset,
            allPokemons : generation.allPokemons,
            limit: generation.limit
        },()=>{
            this.setPokemonListByLimit(
                this.state.offSet,
                itemsByPage
            );
        });
    }

   
    setPokemonListByLimit = (offset,limit)=>{
        
        let pokemonList =[];
        let pokemonListTwo=[];
        this.setState({pokemonList,listFetched:false});
           
        getListOfPokemon(offset,limit).then(res=>res.json()).then(
           ({results})=>{
                pokemonList = results;
                pokemonListTwo = results;
                this.setState({pokemonList,pokemonListTwo,listFetched:true})
           }
       )
    }

    handleModalHide(e){

       this.setState({
            modalShow : false
        })
    }
   
    filterPokemonByNo = ( thispokemon )=>{

        const pokemonNo = utilFunction.getPokemonNumber(thispokemon);
        const isPokemonOfGeneration = pokemonNo <= this.state.limit;
        return isPokemonOfGeneration;
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
    
    handleSelectedPokemon = ( pokemonSelected )=>{
        
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

    addPokemonCheckedToMainList=( pokemonSelected )=>{

        this.setState({
            pokemonList : utilFunction.setPokemonSelectedToList(this.state.pokemonList,pokemonSelected),
            pokemonListTwo : utilFunction.setPokemonSelectedToList(this.state.pokemonListTwo,pokemonSelected)
        },()=>{
            const cantidadSeleccionados = this.state.listaSeleccionados;
            this.setState({
                showNextButton: cantidadSeleccionados === 6
            })
        })
    }

    handleModalShow(pokemon){

        this.setState({
            modalShow : true,
            chain:"loading...",
            description: null,
            pokemon
        },()=>{
            
            const {pokemonNo} = this.state.pokemon;
            fetchPokemonData(pokemonNo).then(data=>{
                this.setState(data);
            });
        })

     }
        
     changeViewBySteps =( button )=>{

            if(button ==='next' && this.state.stepTwo){
                return;
            }else if(button==='play'){
                this.setState({
                    play: true,
                    pokemonsNamesRandom: this.pokemonRandom,
                    pokemonSelectedListOfNames: utilFunction.getPokemonsSelectedFromList(this.state.pokemonListTwo)
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
    

    filterPokemonListWhenSearch  = ( lastInput )=>{

        const pokemonName = lastInput.currentTarget.value.toLowerCase().trim();
        let pokemonList =  this.state.pokemonListTwo;
        
        if(pokemonList !== ""){
             pokemonList = utilFunction.filterPokemonListByName(pokemonName,this.state);
       
        }
        
        this.setState({
            pokemonList 
        });
  
    }

    getContainerPokemonChoosen(){

        return (
            <div className={!this.state.stepTwo?'containerPokemonsChoosen':'hideContainer'}>
                {utilFunction.getImgFromPokemonsSelectedList(this.state.pokemonListTwo, true)}
                <img alt="" className=
                {this.state.showNextButton?'showChooseSuccess':'hideChooseSuccess'} 
                src={require('../../img/chooseSuccess.png')}></img>
                {
                utilFunction.getAnimatedComponent(
                    7000,this.state.exceedErrorVisible,'fadeOut',
                        (
                        <div 
                            className={this.showErrorExClass?'showErrorMessage':'hideContainer'}>
                            <label>Puedes escoger solo 6 pokemon!</label>
                        </div>
                        )
                    )
                }
            </div>
        )

    }

    render(){

        let pokemonList;
       
        if(this.state.listFetched){
             pokemonList = this.getPokemonList();
        }
       
            return(
            <>
                <div className='sticky-nav'>
                    <Search onChange={this.filterPokemonListWhenSearch}/>
                    <Steps state={this.state}></Steps>
                    { 
                        utilFunction.getAnimatedComponent(
                            1000,this.state.stepTwo,'bounceInDown',
                            (<div className='containerOponentChoosen'></div>)
                        )
                     }
    
                     {
                         utilFunction.getAnimatedComponent(
                            1000,!this.state.stepTwo,'bounceInDown', this.getContainerPokemonChoosen()
                        )
                     }

                </div>
                    <div className={!this.state.stepTwo?'containerPokemon':'hideContainer'}>
                        {utilFunction.getAnimatedComponent(2500,true,'slideInLeft',pokemonList)}
                    </div>
                <div className='containerPokemon'>
                    <LISTOPONENTS 
                     state={this.state}
                     pokemonSelected ={utilFunction.getImgFromPokemonsSelectedList(this.state.pokemonListTwo,false)}
                     pokemonRandom = {(pokemonRandom) => this.pokemonRandom = pokemonRandom}
                     >                         
                    </LISTOPONENTS>

                    <BATTLE_ARENA
                    state={this.state}>
                    </BATTLE_ARENA>
                </div>
                    
                <BACKFORWARD 
                changeView={(btn)=>this.changeViewBySteps(btn)} 
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
