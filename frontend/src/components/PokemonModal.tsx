'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Shield, Swords, Zap, HeartPulse, Gauge, Target } from 'lucide-react';
import { fetchPokemonDetail, getImageUrl } from '@/lib/pokeapi';
import { PokemonDetail } from '@/lib/types';
import TypeBadge from './TypeBadge';
import styles from './PokemonModal.module.css';

interface PokemonModalProps {
  id: number | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const statIcons: Record<string, React.ReactNode> = {
  hp: <HeartPulse size={16} />,
  attack: <Swords size={16} />,
  defense: <Shield size={16} />,
  'special-attack': <Zap size={16} />,
  'special-defense': <Target size={16} />,
  speed: <Gauge size={16} />,
};

export default function PokemonModal({ id, onClose, isFavorite, onToggleFavorite }: PokemonModalProps) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchPokemonDetail(id)
        .then(setPokemon)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setPokemon(null);
    }
  }, [id]);

  return (
    <AnimatePresence>
      {id && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={`${styles.modal} glass`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={24} />
            </button>

            <button 
              className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
              onClick={() => onToggleFavorite(id)}
            >
              <Heart fill={isFavorite ? 'currentColor' : 'none'} size={24} />
            </button>

            {loading || !pokemon ? (
              <div className={styles.loader}>
                <div className={styles.spinner} />
              </div>
            ) : (
              <div className={styles.content}>
                <div className={styles.header}>
                  <div className={styles.imageBox}>
                    <img src={getImageUrl(pokemon.id)} alt={pokemon.name} />
                  </div>
                  <div className={styles.titleInfo}>
                    <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
                    <h2 className={styles.name}>{pokemon.name}</h2>
                    <div className={styles.types}>
                      {pokemon.types.map(t => (
                        <TypeBadge key={t.type.name} type={t.type.name} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.body}>
                  <div className={styles.physicalInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Height</span>
                      <span className={styles.value}>{(pokemon.height / 10).toFixed(1)}m</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Weight</span>
                      <span className={styles.value}>{(pokemon.weight / 10).toFixed(1)}kg</span>
                    </div>
                  </div>

                  <div className={styles.statsSection}>
                    <h3>Base Stats</h3>
                    <div className={styles.statsGrid}>
                      {pokemon.stats.map(s => (
                        <div key={s.stat.name} className={styles.statRow}>
                          <div className={styles.statLabel}>
                            {statIcons[s.stat.name]}
                            <span className={styles.statName}>{s.stat.name.replace('-', ' ')}</span>
                          </div>
                          <div className={styles.statBarContainer}>
                            <div className={styles.statBarBg}>
                              <motion.div 
                                className={styles.statBarFill}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                            <span className={styles.statValue}>{s.base_stat}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.abilitiesSection}>
                    <h3>Abilities</h3>
                    <div className={styles.abilitiesList}>
                      {pokemon.abilities.map(a => (
                        <span key={a.ability.name} className={styles.ability}>
                          {a.ability.name.replace('-', ' ')}
                          {a.is_hidden && <em className={styles.hiddenLabel}>(Hidden)</em>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
