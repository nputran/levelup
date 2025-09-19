import { useState } from 'react';
import TitleScreen from '../screens/title-screen';
import BoardSetup from '../screens/board-setup';
import GamePlay from '../screens/game-play';
import Result from '../screens/results';
import TutorialScreen from './components/TutorialScreen';

const tutorialScript = `**Welcome to Bingoji!**
Bingoji is Bingo with emojis instead of numbers.

**🎮 How to Play 🎮**
- Click **Quick Play** at the title screen to start the game, or **Tutorial** to read instructions.
- Each player gets a blank 5x5 Bingo card. Choose 25 emojis from a daily pool of 25–35 emojis:
  - **🫳 Customize:** Drag and drop emojis manually.
  - **🎲 Randomize:** System fills in emojis automatically.
- During the game, a new emoji is called every 5 seconds.
- First to get **5 in a row** (horizontally or vertically) wins.

**⚠️Important Notes ⚠️**
- You have **90 seconds** to customize or randomize your board. After that, blank squares are auto-filled.
`;

export const App = () => {
  const [screen, setScreen] = useState<
    'title' | 'setup' | 'game' | 'result' | 'quick' | 'tutorial'
  >('title');

  switch (screen) {
    case 'title':
      return (
        <TitleScreen
          onQuickPlay={() => setScreen('quick')}
          onTutorial={() => setScreen('tutorial')} // Tutorial mode
        />
      );
    case 'quick':
      return <BoardSetup onComplete={() => setScreen('game')} />;
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
