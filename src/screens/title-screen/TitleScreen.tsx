import React from 'react';

interface TitleScreenProps {
  onQuickPlay: () => void;
  onTutorial: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onQuickPlay, onTutorial }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        backgroundColor: '#ffffff',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <img src="/bingoji-logo.svg" alt="Bingoji Logo" width="500" height="500" />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' }}>
        🎉 Welcome to Bingoji 🎉
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#4B5563', textAlign: 'center', maxWidth: '400px' }}>
        Test your luck and have fun with Bingoji!
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '32px',
          width: '100%',
          maxWidth: '280px',
        }}
      >
        <button
          onClick={onQuickPlay}
          style={{
            width: '100%',
            backgroundColor: '#f678a7',
            color: 'white',
            fontWeight: 600,
            padding: '12px 16px',
            borderRadius: '16px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Quick Play (1 Player)
        </button>

        <button
          onClick={onTutorial}
          style={{
            width: '100%',
            backgroundColor: '#E5E7EB',
            color: '#111827',
            fontWeight: 500,
            padding: '12px 16px',
            borderRadius: '16px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Tutorial
        </button>
      </div>
    </div>
  );
};

export default TitleScreen;
