import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pokedex_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id];
      
      localStorage.setItem('pokedex_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  return { favorites, toggleFavorite, isLoaded };
}
