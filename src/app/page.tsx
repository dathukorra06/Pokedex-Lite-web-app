import { fetchAllPokemon, fetchTypes } from '@/lib/pokeapi';
import PokedexClient from '@/components/PokedexClient';

export default async function Home() {
  const allPokemon = await fetchAllPokemon();
  const types = await fetchTypes();

  return (
    <main>
      <PokedexClient initialPokemon={allPokemon} availableTypes={types} />
    </main>
  );
}
