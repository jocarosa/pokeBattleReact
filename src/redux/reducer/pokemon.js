
import {ADD_POKEMON_LIST} from '../../share';

const initialState={

     
}

function rootReducer(state= initialState,action){
    if(action.type === ADD_POKEMON_LIST){
       
        const s =  Object.assign({},state,{
            pokemonList : action.payload
        });
        
        return s;
    }
    return state;
}

export default rootReducer;