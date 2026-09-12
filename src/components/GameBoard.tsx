import React, { useState } from 'react';
import './GameBoard.css';
import { GameState } from '../types/game';
import { initializeGame, playCard, endTurn } from '../utils/gameEngine';
import PlayerView from './PlayerView';
import Hand from './Hand';

interface GameBoardProps {
  onBackToMenu: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onBackToMenu }) => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const handlePlayCard = (cardIndex: number) => {
    const newGameState = playCard(gameState, cardIndex);
    setGameState(newGameState);
  };

  const handleEndTurn = () => {
    const newGameState = endTurn(gameState);
    setGameState(newGameState);
  };

  const currentPlayer =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player1
      : gameState.player2;
  const opponent =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player2
      : gameState.player1;

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>Tower Clash</h1>
        <button className="btn btn-secondary" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>

      <div className="game-container">
        {/* Opponent View */}
        <div className="opponent-section">
          <PlayerView player={opponent} isOpponent={true} />
        </div>

        {/* Game Info */}
        <div className="game-info">
          <div className="turn-info">
            <h2>Turn {gameState.turnNumber}</h2>
            <p>{currentPlayer.name}'s Turn</p>
          </div>
          <button className="btn btn-primary" onClick={handleEndTurn}>
            End Turn
          </button>
        </div>

        {/* Player View */}
        <div className="player-section">
          <PlayerView player={currentPlayer} isOpponent={false} />
          <Hand
            hand={currentPlayer.hand}
            gold={currentPlayer.gold}
            onPlayCard={handlePlayCard}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
