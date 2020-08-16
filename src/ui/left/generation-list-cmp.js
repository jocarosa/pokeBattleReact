import React  from 'react';
import { gen } from '../../share';
import { Dropdown } from 'react-bootstrap';

const GenerationsList = ({getPokemonListByGeneration}) =>{
    
    const generationList = gen.map((e,i)=>{
        return (

            <Dropdown.Item className='styleLinkDropdown'
                key={i} onClick={()=>getPokemonListByGeneration(e)} 
                href="#/">Generation {e.no}
             </Dropdown.Item>
        )
    })
    
    
    return (
        generationList
    )
}

export default GenerationsList;