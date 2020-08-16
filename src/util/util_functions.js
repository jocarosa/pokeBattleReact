export function filterPokemonListByName ( pokemonName , state ){

    let pokemonList = state.pokemonListTwo;
    if( pokemonName !== "" ){
          pokemonList = state.pokemonListTwo.filter(pokemon=>{
            return pokemon.name.includes(pokemonName)
        })
    }
   
    return pokemonList;
}


export function  getPokemonNumber  ( thispokemon ) {
    const pokemonNo = thispokemon.url.split("/")[6];
    thispokemon["pokemonNo"] = parseInt(pokemonNo);
    return pokemonNo;   
}