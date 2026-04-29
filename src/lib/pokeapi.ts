import { PokemonBasic, PokemonDetail, TypeListResponse, PokemonByTypeResponse } from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export const fetchAllPokemon = async (): Promise<PokemonBasic[]> => {
  // Fetch up to 1025 to cover current main generations without going into too many variants
  const res = await fetch(`${BASE_URL}/pokemon?limit=1025`);
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  const data = await res.json();
  
  return data.results.map((p: any) => ({
    name: p.name,
    url: p.url,
    id: extractIdFromUrl(p.url),
  }));
};

export const fetchTypes = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/type`);
  if (!res.ok) throw new Error('Failed to fetch types');
  const data: TypeListResponse = await res.json();
  return data.results.map(t => t.name).filter(name => name !== 'unknown' && name !== 'shadow');
};

export const fetchPokemonByType = async (type: string): Promise<number[]> => {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon of type ${type}`);
  const data: PokemonByTypeResponse = await res.json();
  return data.pokemon.map(p => extractIdFromUrl(p.pokemon.url));
};

export const fetchPokemonDetail = async (id: number | string): Promise<PokemonDetail> => {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon details for ${id}`);
  return res.json();
};

export const getImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};
