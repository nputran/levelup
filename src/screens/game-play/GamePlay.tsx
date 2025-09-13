import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface GamePlayProps {
  onFinish: () => void;
}

// Helper to check for completed row or column
const checkBingo = (board: (string | null)[], called: string[]) => {
  const size = 5;
  // convert board to 2D
  const grid = Array.from({ length: size }, (_, i) => board.slice(i * size, i * size + size));

  // Check rows
  if (
    grid.every((row) => {
      const col = 0;
      const cellValue = row[col];
      return cellValue !== null && called.includes(cellValue);
    })
  )
    return true;

  // Check columns
  for (let col = 0; col < size; col++)
    if (
      grid.every((row) => {
        const cellValue = row[col];
        return cellValue != null && called.includes(cellValue ?? '');
      })
    )
      return true;
};

const GamePlay: React.FC<GamePlayProps> = ({ onFinish }) => {
  const [board, setBoard] = useState<string[]>([]);
  const [calledEmojis, setCalledEmojis] = useState<string[]>([]);
  const [emojiPool, setEmojiPool] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardAndEmojis = async () => {
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's emojis
      const { data: offerData } = await supabase
        .from('emojis_daily_offers')
        .select('emojis')
        .eq('date', today)
        .single();

      // Fetch player's board (simplified MVP: pick first board)
      const { data: boardData } = await supabase
        .from('boards')
        .select('emojis')
        .eq('date', today)
        .limit(1)
        .single();

      if (offerData?.emojis) setEmojiPool(offerData.emojis);
      if (boardData?.emojis) setBoard(boardData.emojis);

      setLoading(false);
    };

    fetchBoardAndEmojis();
  }, []);

  // Reveal emojis every 5 seconds
  useEffect(() => {
    if (!emojiPool.length) return;
    if (currentIndex >= emojiPool.length) {
      onFinish(); // game over
      return;
    }

    const interval = setInterval(() => {
      setCalledEmojis((prev) => [...prev, emojiPool[currentIndex]]);
      setCurrentIndex((i) => i + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [emojiPool, currentIndex, onFinish]);

  // Check Bingo every time calledEmojis updates
  useEffect(() => {
    if (board.length && checkBingo(board, calledEmojis)) {
      onFinish(); // player won
    }
  }, [calledEmojis, board, onFinish]);

  if (loading) return <div>Loading game...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-3xl font-bold">🎮 Bingoji Game</h2>
      <p className="text-gray-500">Called emojis:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {calledEmojis.map((e, i) => (
          <span key={i} className="text-2xl">
            {e}
          </span>
        ))}
      </div>

      {/* Player board */}
      <div className="grid grid-cols-5 gap-2 mt-6">
        {board.map((emoji, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 flex items-center justify-center border rounded text-2xl ${
              calledEmojis.includes(emoji) ? 'bg-green-200 border-green-400' : 'bg-gray-100'
            }`}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePlay;
