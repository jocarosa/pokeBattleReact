import React  from 'react';
import {gen} from '../../share';
import { Dropdown} from 'react-bootstrap';
const GenerationsList = ({handleGetPokeByGeneration}) =>{
    
    let generationList = gen.map((e,i)=>{
        return (

            <Dropdown.Item className='styleLinkDropdown' key={i} onClick={()=>handleGetPokeByGeneration(e)} href="#/">Generation {e.no}</Dropdown.Item>
            // <li key={i}>
            //     <a onClick={()=>handleGetPokeByGeneration(e)} href='/#'>Generation {e.no}</a>
            // </li>
        )
    })
    
    
    return (
        generationList
       
        // <div>
        //     <label>Generations</label> 
        //     <ul>{generationList}</ul>
        // </div>
    )
}

export default GenerationsList;