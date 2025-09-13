/**
 * @file This file provides a navigation structure for the Bingoji app,
 * which matches the user flow.
 *
 * @summary The file contains:
 * - A useState hook to keep track of the user's flow for navigation.
 * - A switch statement to navigate the user to specific pages based on their current state value.
 *
 * @author Uyen Tran
 */
import { useState } from 'react';
import TitleScreen from '../screens/title-screen';
import WaitingRoom from '../screens/waiting-room';
import BoardSetup from '../screens/board-setup';
import GamePlay from '../screens/game-play';
import Result from '../screens/results';
import TutorialScreen from './components/TutorialScreen';

const tutorialScript = `**Welcome to Bingoji!**
Bingoji is Bingo with emojis instead of numbers.

**🎮 How to Play 🎮**
- Click **Start** at the title screen to play multiplayer, or **Tutorial** to read instructions.
- On the waiting screen, match with 3 other players. The game starts once all 4 players are ready.
- Each player gets a blank 5x5 Bingo card. Choose 25 emojis from a daily pool of 25–35 emojis:
  - **🫳 Customize:** Drag and drop emojis manually.
  - **🎲 Randomize:** System fills in emojis automatically.
- During the game, a new emoji is called every 5 seconds.
- First to get **5 in a row** (horizontally or vertically) wins.
- Players can chat or use stickers to distract opponents.

**⚠️Important Notes ⚠️**
- You have **90 seconds** to customize or randomize your board. After that, blank squares are auto-filled.
- If 1–2 players lose connection during the game, they are eliminated.
- If 3–4 players lose connection, the match is postponed.
`;

export const App = () => {
  const [screen, setScreen] = useState<
    'title' | 'waiting' | 'setup' | 'game' | 'result' | 'quick' | 'tutorial'
  >('title');

  switch (screen) {
    case 'title':
      return (
        <TitleScreen
          onStart={() => setScreen('waiting')} // Multi-player mode
          onQuickPlay={() => setScreen('quick')} // Single-player mode
          onTutorial={() => setScreen('tutorial')} // Tutorial mode
        />
      );
    case 'quick':
      return <BoardSetup onComplete={() => setScreen('game')} />;
    case 'waiting':
      return <WaitingRoom onReady={() => setScreen('setup')} />;
    case 'setup':
      return <BoardSetup onComplete={() => setScreen('game')} />;
    case 'game':
      return <GamePlay onFinish={() => setScreen('result')} />;
    case 'result':
      return <Result onRestart={() => setScreen('title')} />;
    case 'tutorial':
      return <TutorialScreen onBack={() => setScreen('title')} script={tutorialScript} />;
    default:
      return <h1>404: Screen not found</h1>;
  }
};
