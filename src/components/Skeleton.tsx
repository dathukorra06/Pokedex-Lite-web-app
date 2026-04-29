import React from 'react';
import styles from './Skeleton.module.css';

export function PokemonCardSkeleton() {
  return (
    <div className={`${styles.cardSkeleton} ${styles.skeleton}`}>
      <div className={`${styles.circle} ${styles.skeleton}`} />
      <div className={`${styles.line} ${styles.skeleton}`} />
      <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
        <div className={`${styles.smallLine} ${styles.skeleton}`} />
        <div className={`${styles.smallLine} ${styles.skeleton}`} />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </>
  );
}
