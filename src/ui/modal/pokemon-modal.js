import React,{ Component  }  from 'react';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';

import styled from 'styled-components';
import { Row , Col } from 'react-bootstrap';
import './style.css' ;
import './scroll.css';
import { fetchPokemonData } from '../../services/fetchPokemonData';

 const H2 = styled.div`
    text-align:center;
    color:black;
    font-weight:bold;
    paddin:5px;
`;
const H1 = styled.div`

text-align:center;
color:white;
font-weight:bold;

`;




class PokemonDetailModal extends Component{

    state = {

        pokemonName:"",
        pokemonNo:null,
        types:null,
        description:"",
        chain:null
     }
  

    constructor(props){
        super(props);
        
        this.prepareState = this.prepareState.bind(this);
              
       
    }

   
    
    render(){

        if(!this.props.show){
            return null;
        }
        
        let typeData;
        let pokemonName;
        let pokemonNo;
        let description;
        let chain;
        let types;
        let urlImageAnimated;

        if(this.state.pokemonName === ""){
            
             typeData =  get(this.props,'types','');
             pokemonNo =  get(this.props,'description.id','');
             pokemonName =  get(this.props,'description.name','');
             description =  (this.props.description != null ) ? getDescription(this.props.description):"Loading...";
             urlImageAnimated =  require('../../img/loadingImg.gif');
             chain = this.getEvolutionChain(this.props.chain,[]);
             
            if(typeData!=="") {
                    types =  getTypes(typeData.types);
            }
            if(pokemonName!==""){
          
                urlImageAnimated =  `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonName}.gif`;
             }  
          
        }else{
            
            pokemonName = this.state.pokemonName;
            urlImageAnimated =  this.state.urlImageAnimated;
            pokemonNo = this.state.pokemonNo;
            description = this.state.description;
            chain = this.state.chain; 
            types = this.state.types;
         
        }
     
        
    
        
    return (  
        
        <Modal
            {...this.props}
            backdrop="static"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="my-modal"
        >
                <Modal.Body>
                    <div className='styleClose'><a href='/#' onClick={()=>this.onHide()}>X</a></div>
                    <div className='containerImage'> <img alt='' className='pokemonImage' src={urlImageAnimated}></img></div>
                    <div className="containerInfo">
                        
                    <Row>
                        <Col>
                            
                                <div className='containerName'>
                                <H1> 
                                    <span><img alt='' className='stylePokeIcon' src={require(`../../img/pokeicon.png`)} /></span>
                                    No: <span className='styleNo'> {pokemonNo}</span>{pokemonName.toUpperCase()}</H1>
                                </div>
                              
                        </Col>
                    </Row>
                    <Row>
                    <div className='containerTypes'>
                    <Col xs={12}>
                        
                            {types}
                       
                    </Col> </div>
                    </Row>
                  
                    <Row>
                        <Col xs={12}>
                            
                                 <H2>Description</H2>
                            
                        </Col>
                    </Row> 
                    <Row >   
                        <Col>
                        <div className='scrollbar scrollbar-danger containerDescription'>
                                {description}
                         </div>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                           
                        <H2>Evolution</H2></Col>
                    </Row> 
                    <Row>
                        <Col className='parentContainerEvolution'>
                        <div className='containerEvolution'>
                        {chain}
                        </div>
                        </Col> 
                    </Row>
                    </div>
                 
                </Modal.Body>
        </Modal>
     
    );

    } 

    onHide(){
        this.setState({
            pokemonName:""
        })
        
        this.props.onHide();
    }
     getEvolutionChain = (res,pokemonChain)=>{

        if(res == null || !res.hasOwnProperty('id')) return res;
        
        mapListChain(res.chain,res.evolves_from,pokemonChain);
        
            return pokemonChain.map((pokeFromChain,key)=>{
                
                if(pokeFromChain ===""){
                    return ;
                }
               
            const urlPokeImg = `https://img.pokemondb.net/sprites/platinum/normal/${pokeFromChain}.png`;
            return (
            <a key={key} onClick={()=>this.loadDataPokeChain(pokeFromChain)} href='/#'>
                <div  key={key}>
                    <img alt='' className='stylePokeChain'src={urlPokeImg}/>
                </div>
            </a>
            )
        }); 
        
        }


    
         loadDataPokeChain (pokemonName){
           
            this.setState({ 
                pokemonName : pokemonName,
                urlImageAnimated:require('../../img/loadingImg.gif')
            },()=>{
                this.prepareState(pokemonName);
            })

    }



   async prepareState(pokemonNombre){
    const data = await fetchPokemonData(pokemonNombre);
    const typeData = get(data,'types','');
    const pokemonName = get(data,'description.name','');
    const pokemonNo = get(data,'description.id','');
    const description = (data.description != null) ? getDescription(data.description):"Loading...";
    const chain = this.getEvolutionChain(data.chain,[]);
    const urlImageAnimated = `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonName}.gif`;
        
    let types;
    if(typeData!=="") {
            types = getTypes(typeData.types);
    }
            
            this.setState({
                pokemonName,
                pokemonNo,
                types,
                description,
                chain,
                urlImageAnimated
            });
               
    }
}

  

const getTypes = (arrayTypes)=>{
    
    return arrayTypes.map(({type},key)=>{
        
        return (
            <div className='type' key={key}>
                    <img alt='' src={require(`../../img/types/${type.name}.png`)} />
                    <p><strong>{type.name}</strong></p> 
                </div>
            )
    });
}

const getDescription = (description)=>{
    if(description == null) return "Loading...";
    return (description.flavor_text_entries.filter(text=>{
        return text.language.name ==="en"
    }))[0].flavor_text
}

const mapListChain = (resChain,evolves_from,pokemonChain) => {
    
    const {evolves_to} = resChain;
    
    if(evolves_from != null){
        pokemonChain.push(evolves_from)
    }

    if( evolves_to.length >= 1 ){
        if(evolves_to.length>1){
            evolves_to.map(({species})=>{
                if(!pokemonChain.includes(species.name)) pokemonChain.push(species.name);
            })
        }else{
            if(!pokemonChain.includes( evolves_to[0].species.name )) pokemonChain.push( evolves_to[0].species.name )
            mapListChain(evolves_to[0],null,pokemonChain)
        }
        
    }
    
}







export default PokemonDetailModal;