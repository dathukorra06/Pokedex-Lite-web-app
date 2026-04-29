'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center',
      color: '#fff',
      background: '#0F172A'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h2>
      <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>{error.message || "Failed to load the Pokedex."}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          background: '#FF4B4B',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
