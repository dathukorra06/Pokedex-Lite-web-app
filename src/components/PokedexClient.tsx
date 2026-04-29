'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Heart, Filter, LogIn, ArrowUp } from 'lucide-react';
import { PokemonBasic } from '@/lib/types';
import { fetchPokemonByType } from '@/lib/pokeapi';
import { useFavorites } from '@/hooks/useFavorites';
import PokemonCard from './PokemonCard';
import PokemonModal from './PokemonModal';
import { GridSkeleton } from './Skeleton';
import styles from './PokedexClient.module.css';

interface PokedexClientProps {
  initialPokemon: PokemonBasic[];
  availableTypes: string[];
}

const ITEMS_PER_PAGE = 20;

export default function PokedexClient({ initialPokemon, availableTypes }: PokedexClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [typePokemonIds, setTypePokemonIds] = useState<number[] | null>(null);
  const [loadingType, setLoadingType] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const { favorites, toggleFavorite } = useFavorites();

  // Reset page when search or fav toggle change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showOnlyFavorites]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch pokemon by type when selectedType changes
  useEffect(() => {
    async function updateTypeFilter() {
      if (selectedType === 'all') {
        setTypePokemonIds(null);
        setCurrentPage(1);
        return;
      }
      
      setLoadingType(true);
      try {
        const ids = await fetchPokemonByType(selectedType);
        setTypePokemonIds(ids);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error filtering by type:', error);
      } finally {
        setLoadingType(false);
      }
    }
    updateTypeFilter();
  }, [selectedType]);

  const filteredPokemon = useMemo(() => {
    return initialPokemon.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorite = showOnlyFavorites ? favorites.includes(p.id) : true;
      const matchesType = typePokemonIds ? typePokemonIds.includes(p.id) : true;
      
      return matchesSearch && matchesFavorite && matchesType;
    });
  }, [initialPokemon, searchTerm, showOnlyFavorites, favorites, typePokemonIds]);

  // Paginated data
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);
  const paginatedPokemon = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemon.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemon, currentPage]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logoArea}>
            <div className={styles.titleWrapper}>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pokedex Logo" className={styles.logoIcon} />
              <h1 className="gradient-text">Pokedex Lite</h1>
            </div>
            <p>Catch &apos;em all, browse through the world of Pokemon.</p>
          </div>
          <button 
            className={`${styles.loginBtn} glass`}
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            <LogIn size={18} />
            <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
          </button>
        </div>

        <div className={styles.controls}>
          <div className={`${styles.searchWrapper} glass`}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Pokemon name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={`${styles.selectWrapper} glass`}>
              <Filter size={18} className={styles.filterIcon} />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.typeSelect}
              >
                <option value="all">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className={`${styles.favToggle} glass ${showOnlyFavorites ? styles.active : ''}`}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              title={showOnlyFavorites ? "Show all" : "Show favorites"}
            >
              <Heart size={20} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
              <span>Favorites</span>
            </button>

            {(searchTerm || selectedType !== 'all') && (
              <button 
                className={styles.clearBtn}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.resultsCount}>
          Displaying <strong>{filteredPokemon.length}</strong> Pokemon
        </div>
      </header>

      {loadingType ? (
        <div className={styles.grid}>
          <GridSkeleton />
        </div>
      ) : paginatedPokemon.length > 0 ? (
        <>
          <div className={styles.grid}>
            {paginatedPokemon.map((p) => (
              <PokemonCard 
                key={p.id}
                id={p.id}
                name={p.name}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedPokemonId}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                className={`${styles.pageBtn} glass`}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={20} />
                <span>Prev</span>
              </button>
              
              <span className={styles.pageInfo}>
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button 
                className={`${styles.pageBtn} glass`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.noResults}>
          <h3>No Pokemon found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      <PokemonModal 
        id={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
        isFavorite={selectedPokemonId ? favorites.includes(selectedPokemonId) : false}
        onToggleFavorite={toggleFavorite}
      />

      {showBackToTop && (
        <button 
          className={`${styles.backToTop} glass`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
