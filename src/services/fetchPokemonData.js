import  {get} from 'lodash';

export async function fetchPokemonData(pokemonNo){

    const resTypes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNo}/`);
        const dataType = await resTypes.json();
        const resDes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNo}/`);
        const dataDescription = await resDes.json();
        const res = await fetch(dataDescription.evolution_chain.url);
        const dataEvolutionChain = await res.json();
        
        dataEvolutionChain["evolves_from"] = get(dataDescription,'evolves_from_species.name','');

        return {
            chain : dataEvolutionChain,
            description: dataDescription, 
            types: dataType   
        }
}