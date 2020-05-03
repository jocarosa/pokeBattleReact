import React from 'react';
import {Pagination} from 'react-bootstrap';
import {connect} from 'react-redux';
import {itemsByPage} from '../../share';

const mapStateProps = state => {
    const {pokemonList} = state.pokemons;
    
    return {
        pokemonList
    }
  }


class Paginador extends React.Component{

    state={
        active:1
    }

     constructor(props){
        super(props);
    }

    getSizePaginator(allPokemons){
        return Math.ceil(allPokemons / itemsByPage);
    }

    componentDidMount = () =>{
        this.loadItems();
    }

     loadItems = ()=> {

        let items = [];
             
        for (let number = 1; number <= this.getSizePaginator(this.props.config.allPokemons); number++) {
         
            items.push(
              <Pagination.Item key={number} active={number === this.state.active} onClick={()=>this.next(number)}>
                {number}
              </Pagination.Item>
            );
        }

         return items;
    }

    next(currentItem){
        
         this.setState({
            active:currentItem
         })

         const offSet =  itemsByPage * currentItem + this.props.config.offSet - itemsByPage  ;
         
         const url  = `https://pokeapi.co/api/v2/pokemon/?offset=${offSet}&limit=${itemsByPage}`;

         this.props.handlePokemonApi(url);
       
    }
 
    render(){
     
        return(
            <div>
                <Pagination size="sm">{this.loadItems()}</Pagination>
            </div>
        )
    }
}


const Paginator = connect(
    mapStateProps,
    null
)(Paginador);

export default Paginator;


