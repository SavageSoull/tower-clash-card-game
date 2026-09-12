import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import MainMenu from './components/MainMenu';

type GameScreen = 'menu' | 'game';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="app">
      {currentScreen === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}
      {currentScreen === 'game' && (
        <GameBoard onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default App;
