import { PokemonInfiniteListClient } from './pokemon-infinite-demo/pokemon-infinite-list-client'
import { fetchPokemon } from './pokemon-infinite-demo/api'

export async function PokemonInfiniteList() {
  const pageSize = 12

  const initialPokemon = await fetchPokemon(0, pageSize * 2)

  return (
    <PokemonInfiniteListClient
      initialPokemon={initialPokemon}
      pageSize={pageSize}
    />
  )
}

export default PokemonInfiniteList
