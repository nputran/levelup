import React from 'react';

interface ResultProps {
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ onRestart }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.5rem',
        background: 'linear-gradient(to bottom right, #f9fafb, #fee2e2)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0,
        }}
      >
        🏆 Game Over!
      </h2>
      <p
        style={{
          fontSize: '1.25rem',
          color: '#374151',
          margin: 0,
        }}
      >
        Thanks for playing Bingoji!
      </p>
      <button
        onClick={onRestart}
        style={{
          marginTop: '1rem',
          backgroundColor: '#f678a7',
          color: 'white',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          border: 'none',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, transform 0.15s ease',
        }}
        onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#b91c1c')}
        onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#dc2626')}
        onMouseDown={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(0.98)')}
        onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = 'scale(1)')}
      >
        Back to Title
      </button>
    </div>
  );
};

export default Result;
