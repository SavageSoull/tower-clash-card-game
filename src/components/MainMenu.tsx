import React from 'react';
import './MainMenu.css';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">⚔️ Tower Clash</h1>
        <p className="game-subtitle">A Turn-Based Card Battle Game</p>
        
        <button className="btn btn-primary" onClick={onStartGame}>
          Start Game
        </button>
        
        <div className="menu-info">
          <h2>How to Play</h2>
          <ul>
            <li>Build a deck and battle your opponent</li>
            <li>Play minions to attack towers and the enemy castle</li>
            <li>Gain gold each turn (max 10)</li>
            <li>Destroy all towers and the castle to win</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
