'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { fetchPokemonDetail, getImageUrl } from '@/lib/pokeapi';
import { PokemonDetail } from '@/lib/types';
import TypeBadge from './TypeBadge';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  id: number;
  name: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: (id: number) => void;
}

export default function PokemonCard({ id, name, isFavorite, onToggleFavorite, onClick }: PokemonCardProps) {
  const [details, setDetails] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDetails() {
      try {
        const data = await fetchPokemonDetail(id);
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading pokemon details:', error);
        if (isMounted) setLoading(false);
      }
    }
    loadDetails();
    return () => { isMounted = false; };
  }, [id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  return (
    <div className={`${styles.card} glass`} onClick={() => onClick(id)}>
      <span className={styles.id}>#{String(id).padStart(3, '0')}</span>
      
      <button 
        className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      <div className={styles.imageContainer}>
        {loading ? (
          <div className={styles.skeletonImage} />
        ) : (
          <img src={getImageUrl(id)} alt={name} loading="lazy" />
        )}
      </div>

      <h3 className={styles.name}>{name}</h3>
      
      <div className={styles.types}>
        {details?.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
        {loading && <div style={{ height: '24px' }} />}
      </div>
    </div>
  );
}
