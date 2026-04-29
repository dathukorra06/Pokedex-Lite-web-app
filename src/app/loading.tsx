import React from 'react';
import { GridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ height: '4rem', width: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem' }} />
        <div style={{ height: '1.5rem', width: '450px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: '2rem' 
      }}>
        <GridSkeleton />
      </div>
    </div>
  );
}
