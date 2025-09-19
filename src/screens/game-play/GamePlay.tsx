import React, { useEffect, useState, useRef } from 'react';
import { masterEmojis } from '../../emojiList';

interface GamePlayProps {
  onFinish: () => void;
}

const checkBingo = (board: (string | null)[], called: string[]) => {
  const size = 5;
  const grid = Array.from({ length: size }, (_, i) => board.slice(i * size, i * size + size));

  // Rows
  for (let row = 0; row < size; row++) {
    if (grid[row].every((cell) => cell && called.includes(cell))) return true;
  }

  // Columns
  for (let col = 0; col < size; col++) {
    if (grid.every((row) => row[col] && called.includes(row[col]!))) return true;
  }

  // Diagonals
  if (grid.every((row, i) => row[i] && called.includes(row[i]!))) return true;
  if (grid.every((row, i) => row[size - 1 - i] && called.includes(row[size - 1 - i]!))) return true;

  return false;
};

const GamePlay: React.FC<GamePlayProps> = ({ onFinish }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const [board, setBoard] = useState<string[]>([]);
  const [calledEmojis, setCalledEmojis] = useState<string[]>([]);
  const [emojiPool, setEmojiPool] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameOver, setGameOver] = useState(false);

  // Load board from localStorage or props on mount
  useEffect(() => {
    const savedBoard = localStorage.getItem('bingoBoard');
    if (savedBoard) {
      const parsedBoard = JSON.parse(savedBoard);
      setBoard(parsedBoard); // <-- Keep the board from setup
    }

    // Shuffle emoji pool for calling
    const shuffled = [...masterEmojis].sort(() => 0.3 - Math.random());
    setEmojiPool(shuffled);

    setLoading(false);
  }, []);

  // Auto-start music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => console.log('Autoplay blocked'));
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const finishGame = () => {
    if (!gameOver) {
      setGameOver(true);
      onFinish();
    }
  };

  // Call new emoji every 5s
  useEffect(() => {
    if (!emojiPool.length || gameOver) return;

    const interval = setInterval(() => {
      setCalledEmojis((prev) => {
        if (currentIndex < emojiPool.length) {
          return [...prev, emojiPool[currentIndex]];
        }
        return prev;
      });
      setCurrentIndex((i) => i + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [emojiPool, currentIndex, gameOver]);

  // Countdown timer
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  // Check Bingo
  useEffect(() => {
    if (!gameOver && board.length && calledEmojis.length > 0 && checkBingo(board, calledEmojis)) {
      finishGame();
    }
  }, [calledEmojis, board, gameOver]);

  if (loading) return <div>Loading game...</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(to bottom right, #F9FAFB, #FEE2E2)',
      }}
    >
      <audio ref={audioRef} loop>
        <source src="/music/bingoji-song.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleMusic}
        style={{
          alignSelf: 'flex-end',
          marginBottom: '12px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isPlaying ? '#F87171' : '#34D399',
          color: 'white',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {isPlaying ? '🔇 Mute Music' : '🎵 Play Music'}
      </button>

      <h2
        style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}
      >
        🎮 Bingoji Game
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#DC2626', marginBottom: '16px' }}>
        ⏳ Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </p>

      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
        <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '8px' }}>
          📢 Called Emojis:
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            minHeight: '60px',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {calledEmojis.length === 0 && (
            <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Waiting for first call...</span>
          )}
          {calledEmojis.map((e, i) => (
            <span
              key={i}
              style={{
                fontSize: '1.6rem',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: i === calledEmojis.length - 1 ? '#FEF3C7' : '#F3F4F6',
                border: i === calledEmojis.length - 1 ? '2px solid #F59E0B' : '1px solid #D1D5DB',
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 70px)',
          gridTemplateRows: 'repeat(5, 70px)',
          gap: '8px',
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: '#fff',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        {board.map((emoji, idx) => {
          const isCalled = calledEmojis.includes(emoji);
          return (
            <div
              key={idx}
              style={{
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                borderRadius: '10px',
                backgroundColor: isCalled ? '#BBF7D0' : '#F9FAFB',
                border: isCalled ? '2px solid #16A34A' : '2px solid #D1D5DB',
                transform: isCalled ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: isCalled ? '0 3px 8px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamePlay;
