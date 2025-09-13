import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface WaitingRoomProps {
  onReady: () => void;
}

const POLL_INTERVAL = 2000; // 2 seconds

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onReady }) => {
  const [playersCount, setPlayersCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('id, status, players')
        .eq('status', 'waiting')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching game:', error);
      } else if (data) {
        // Assuming "players" is an array of user IDs
        setPlayersCount(data.players.length);
        if (data.players.length >= 4) {
          onReady(); // all players joined, move to BoardSetup
        }
      }
      setLoading(false);
    };

    interval = setInterval(fetchPlayers, POLL_INTERVAL);
    fetchPlayers(); // initial fetch

    return () => clearInterval(interval);
  }, [onReady]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-3xl font-bold text-gray-900">⏳ Waiting Room</h2>
      <p className="text-lg text-gray-700">Waiting for 4 players to join...</p>
      <p className="text-xl text-gray-900 font-semibold">Players joined: {playersCount}/4</p>
      {loading && <p className="text-gray-500">Loading...</p>}
    </div>
  );
};

export default WaitingRoom;
