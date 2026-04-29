import React from 'react';
import styles from './TypeBadge.module.css';

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor: `var(--type-${type.toLowerCase()}, #777)`,
      }}
    >
      {type}
    </span>
  );
}
