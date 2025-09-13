import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { masterEmojis } from '../../emojiList';

interface BoardSetupProps {
  onComplete: () => void;
}

const BOARD_SIZE = 25; // 5x5 board
const TIMER_SECONDS = 90;
const DAILY_EMOJI_COUNT = 35;

const BoardSetup: React.FC<BoardSetupProps> = ({ onComplete }) => {
  const [emojiPool, setEmojiPool] = useState<string[]>([]);
  const [selectedEmojis, setSelectedEmojis] = useState<(string | null)[]>(
    Array(BOARD_SIZE).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmojis = async () => {
      const today = new Date().toISOString().split('T')[0];
      let todayEmojis: string[] = [];

      // --- Supabase version (for long-term) ---
      const { data } = await supabase
        .from('emojis_daily_offers')
        .select('emojis')
        .eq('date', today)
        .single();

      if (data?.emojis) {
        todayEmojis = data.emojis;
      } else {
        // Fallback: Generate from master list
        const shuffled = [...masterEmojis].sort(() => 0.5 - Math.random());
        todayEmojis = shuffled.slice(0, DAILY_EMOJI_COUNT);
      }

      setEmojiPool(todayEmojis);
      setLoading(false);
    };

    fetchEmojis();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      autoFillRemaining();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const autoFillRemaining = () => {
    const remaining = BOARD_SIZE - selectedEmojis.length;
    const available = emojiPool.filter((e) => !selectedEmojis.includes(e));
    const newSelections = available.slice(0, remaining);

    setSelectedEmojis((prev) => [...prev, ...newSelections]);
    finishBoard([...selectedEmojis, ...newSelections] as string[]);
  };

  const finishBoard = async (finalBoard: string[]) => {
    // TODO: save board to Supabase boards table here
    console.log('Final board:', finalBoard);
    onComplete();
  };

  const handleRandomize = () => {
    const shuffled = [...emojiPool].sort(() => 0.5 - Math.random());
    const randomBoard = Array(BOARD_SIZE)
      .fill(null)
      .map((_, i) => shuffled[i]);
    setSelectedEmojis(randomBoard);
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmojis((prev) => {
      const newBoard = [...prev];
      const emptyIndex = newBoard.indexOf(null);
      if (emptyIndex === -1) return newBoard; // all filled
      newBoard[emptyIndex] = emoji;
      return newBoard;
    });
  };

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.5rem',
        }}
      >
        Loading emojis...
      </div>
    );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#F9FAFB',
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
        📝 Setup Your Bingo Board
      </h2>
      <p style={{ color: '#4B5563' }}>Select 25 emojis from the pool below:</p>
      <p style={{ color: '#6B7280' }}>Time left: {timeLeft}s</p>

      {/* Droppable Bingo Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 60px)',
          gridTemplateRows: 'repeat(5, 60px)',
          gap: '6px',
          margin: '16px 0',
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, i) => (
          <div
            key={i}
            onDragOver={(e) => e.preventDefault()} // Allow drop feature
            onDrop={(e) => {
              const droppedEmoji = e.dataTransfer.getData('emoji');
              if (!droppedEmoji) return;

              setSelectedEmojis((prev) => {
                if (prev.includes(droppedEmoji)) return prev; // Avoid duplication
                const newBoard = [...prev];
                newBoard[i] = droppedEmoji; // Place the emoji in that slot
                return newBoard;
              });
            }}
            style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              border: '2px dashed #D1D5DB',
              borderRadius: '8px',
              backgroundColor: selectedEmojis[i] ? '#FEE2E2' : '#F9FAFB',
            }}
          >
            {selectedEmojis[i] || ''}
          </div>
        ))}
      </div>

      {/* Draggable Emoji Pool */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          margin: '16px 0',
        }}
      >
        {emojiPool.map((emoji) => {
          const isSelected = selectedEmojis.includes(emoji);
          return (
            <button
              key={emoji}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('emoji', emoji);
              }}
              style={{
                padding: '8px',
                fontSize: '1.5rem',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: isSelected ? '#DC2626' : '#D1D5DB',
                backgroundColor: isSelected ? '#FCA5A5' : '#F3F4F6',
                cursor: 'grab',
                textAlign: 'center',
              }}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {/* Randomize Button */}
        <button
          onClick={handleRandomize}
          style={{
            backgroundColor: '#DC2626',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Randomize
        </button>

        {/* Confirm Button */}
        <button
          onClick={() => finishBoard(selectedEmojis as string[])}
          disabled={selectedEmojis.some((e) => !e)}
          style={{
            backgroundColor: selectedEmojis.length === BOARD_SIZE ? '#16A34A' : '#A7F3D0',
            color: selectedEmojis.length === BOARD_SIZE ? 'white' : '#065F46',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            cursor: selectedEmojis.length === BOARD_SIZE ? 'pointer' : 'not-allowed',
            fontWeight: 600,
          }}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default BoardSetup;
