
import React ,  {Component} from 'react';

//cmp
import Search from './search-cmp';
import GenerationsList from '../left/generation-list-cmp';
import PokemonDetailModal from '../modal/pokemon-modal';
//import Paginator from './pagination';
import { itemsByPage , urlAnimated , urlNormal} from '../../share';
import { fetchPokemonData } from '../../services/fetchPokemonData';

//styles
import { Navbar,Nav,DropdownButton } from 'react-bootstrap';
import './style.css';
import styled, { keyframes } from 'styled-components';
import { bounceInLeft } from 'react-animations';

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

const CONTAINERPOKE = styled.div`
  animation: 1s  ${keyframes `${bounceInLeft}`}
`


class List extends Component{

    state = {
        pokemonList : [],
        allPokemons: 150,
        limit:150,
        offSet:0,
        description:null,
        chain:null,
       // pokemonsSelected:[],
        listSelected:[]
    }
   // pokemonsSelected=[];
    styleHover;

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
        let pokemonList =null;
        let pokemonListTwo=null;
        this.setState({pokemonList,listFetched:false})

        fetch(url).then(res=>res.json()).then(
           ({results})=>{
                pokemonList = results;
                pokemonListTwo = results;
                this.setState({pokemonList,pokemonListTwo,listFetched:true})
               // this.props.addPokemonList(pokemonList);
           }
       )

    }

    handleSelectedPokemon = (pokemonSelected)=>{
            
            const isChecked = pokemonSelected.checked;
            this.setState({
                pokemonList : this.state.pokemonList.map(poke=>
                    poke.name === pokemonSelected.pokemonName ? {...poke, isChecked}:poke
                ),
                pokemonListTwo : this.state.pokemonListTwo.map(poke=>
                    poke.name === pokemonSelected.pokemonName ? {...poke, isChecked}:poke
                )
            },()=>{
                
               let list = this.state.pokemonListTwo.filter(s=>{
                    if(s.hasOwnProperty("isChecked")){
                        return s.isChecked
                    }
                })

                    this.setState({
                        listSelected:list,
                        showNextButton: list.length == 6
                    })
            })
        
    }   
    getPokemonIndexFromList = (pokemonList,pokemonName)=>{
        const index = pokemonList.findIndex(
            SelectedPoke=>SelectedPoke.pokemonName === pokemonName
        );

        return index;
    }

    damePokemonElegidos = ()=>{
        let pokemonChoose = [];
        for(let ch=1;ch<=6;ch++){
            if(typeof this.state.listSelected[ch-1]  !== "undefined"){
                const pokemonName = this.state.listSelected[ch-1].name;
                pokemonChoose.push(
                <div className='containerPokeChoose'>
                    <img className='styleImgPokeChoose' key={ch} src={`${urlNormal}${pokemonName}.png`}></img>
                    <label onClick={()=>this.handleSelectedPokemon({
                        pokemonName,
                        checked:false
                    })}className='styleXChoose'>X</label> 
                </div>    
                );
                continue;
            }
            pokemonChoose.push(
            <div className='containerPokeChoose'>
                <img key={ch} className='styleBallChooseTwo' src={require('../../img/pokeball.png')}></img>
            </div>
            )
        }

        return pokemonChoose.map(s=>s);
    }

        render(){

            let pokemonListContainer = <h2>Loading...</h2>;
           


            if(this.state.listFetched){

                const filterPokemonByNo = (thispokemon)=>{

                    const pokemonNo = getPokemonNo(thispokemon);
                    const isPokemonOfGeneration = pokemonNo <= this.state.limit;
                    return isPokemonOfGeneration;
                }
                const getPokemonNo = (thispokemon)=>{
                    const pokemonNo = thispokemon.url.split("/")[6];
                    thispokemon["pokemonNo"] = parseInt(pokemonNo);
                   return pokemonNo;
                }
                pokemonListContainer =  this.state.pokemonList.filter(p=>filterPokemonByNo(p))
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


            }


            return(
                <>
                {/* 
                    <Navbar className='sticky-nav' >
                        <Navbar.Brand href="#home">Poke Arena</Navbar.Brand>
                        <Nav className="mr-auto">
                        <Search className='styleDropdown' onChange={this.handlePokemonSearch}/>
                        { <DropdownButton variant="outline-danger" className='styleDropdown' id="dropdown-basic-button" title="Generation">
                            <GenerationsList handleGetPokeByGeneration = {this.handleGetPokeByGeneration} />
                        </DropdownButton> }
                        </Nav>
                    </Navbar> */}
                    <div className='sticky-nav'>
                        <Search onChange={this.handlePokemonSearch}/>
                        <Steps></Steps>
                        <div className='containerPokemonsChoosen'>
                          {this.damePokemonElegidos()}
                          <img className=
                          {this.state.showNextButton?'showChooseSuccess':'hideChooseSuccess'} 
                          src={require('../../img/chooseSuccess.png')}></img>
                        </div>
                    </div>
                   
                    
                   <CONTAINERPOKE>
                        <div className='containerPokemon' >
                            {pokemonListContainer}
                        </div>
                    </CONTAINERPOKE>
                    <BACKFORWARD steps={this.state}></BACKFORWARD>
                
                    <PokemonDetailModal
                    chain = {this.state.chain}
                    description = {this.state.description}
                    types = {this.state.types}
                    show={this.state.modalShow}
                    onHide={()=>this.handleModalHide()} />

                    {/* <Paginator config={this.state} handlePokemonApi={this.handlePokemonApi} /> */}
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
           /* pokemonSelected : this.props.isPokeChecked || false,
            noSelected:0*/
        };
        //this.pokemonSelected = this.props.isPokeChecked;
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
         const selectPokemon =(pokemonName)=>{
           this.pokemonSelected = !this.pokemonSelected;
           this.props.selectPokemon({pokemonName,checked:this.pokemonSelected});
         }

        return (
            
            <>
     
             <div onClick={()=>selectPokemon(pokemonName)} className='itemPokemon'
                 style={ setStyleHover }
                 onMouseOver={ () => onHoverPokemon() }
                 onMouseOut={ () => onOutPokemon() } >
                <div  className="checkbox custom" >
                 <input onClick={()=>selectPokemon(pokemonName)} checked={this.props.isChecked}  id={pokemonName} className="css-checkbox" type="checkbox" />
                 <label htmlFor={pokemonName} className="css-label-red"></label> 
                </div>
                 <img alt='' className={this.props.isChecked?"stylePokemonChecked":"stylePokemonImg"} src={ this.state.hover?this.state.url : `${urlNormal}${pokemonName}.png` }></img>
             </div>
            
            </>
        )
            
         
            
           
            
           
        
    }
}

export default PokemonList;