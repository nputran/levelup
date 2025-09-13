import React from 'react';

interface TutorialScreenProps {
  onBack: () => void;
  script: string;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack, script }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#F3F4F6',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>📖 Tutorial</h2>

      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          flexGrow: 1,
          lineHeight: 1.6,
        }}
      >
        {script.split('\n').map((line, i) => {
          // Indent sub-bullets
          const isSubBullet = line.trim().startsWith('- ');
          return (
            <p
              key={i}
              style={{
                marginLeft: isSubBullet ? '20px' : '0px',
                marginBottom: '8px',
                whiteSpace: 'pre-line',
                color: '#111827',
              }}
              dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
            />
          );
        })}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: '24px',
          backgroundColor: '#62aec5',
          color: 'white',
          fontWeight: 600,
          padding: '12px 20px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
    </div>
  );
};

export default TutorialScreen;
