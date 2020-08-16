import  { get } from 'lodash';
import { pokeApiUrl } from '../share';

export async function fetchPokemonData(pokemonNo){
       
        return {
            chain : getEvolutionChainInfo(pokemonNo),
            description: getPokemonSpecieInfo(pokemonNo), 
            types: getBasicPokemonInfo(pokemonNo)   
        }
}

async function getBasicPokemonInfo(pokemonNo){
    return await fetch(`${pokeApiUrl}pokemon/${pokemonNo}/`).json();
}

async function getPokemonSpecieInfo(pokemonNo){
    return await fetch(`${pokeApiUrl}pokemon-species/${pokemonNo}/`).json();
}

async function getEvolutionChainInfo(pokemonNo){
    
    let evolutionChainInfo = await fetch(
        getBasicPokemonInfo(pokemonNo).evolution_chain.url).json();

    evolutionChainInfo["evolves_from"] = get(
        getPokemonSpecieInfo(pokemonNo),'evolves_from_species.name','');
    
    return evolutionChainInfo;

}
export async function getListOfPokemon(offset,limit){
    return await fetch(`${pokeApiUrl}pokemon/?offset=${offset}&limit=${limit}`);
}