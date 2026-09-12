import React from 'react';
import { Player } from '../types/game';
import './PlayerView.css';

interface PlayerViewProps {
  player: Player;
  isOpponent: boolean;
}

const PlayerView: React.FC<PlayerViewProps> = ({ player, isOpponent }) => {
  return (
    <div className={`player-view ${isOpponent ? 'opponent' : 'current'}`}>
      {/* Board at top */}
      <div className="board">
        <h4>⚔️ Board ({player.board.length} minions)</h4>
        <div className="minion-list">
          {player.board.length === 0 ? (
            <p className="empty-board">No minions</p>
          ) : (
            player.board.map((minion) => (
              <div key={minion.id} className="minion-card">
                <div className="minion-name">{minion.name}</div>
                <div className="minion-stats">
                  <span className="attack">⚔️ {minion.attack}</span>
                  <span className="health">❤️ {minion.health}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Player name and stats */}
      <div className="player-name">🧙 {player.name}</div>
      
      <div className="player-stats">
        <div className="stat">
          <span className="label">Castle:</span>
          <span className="value">
            {player.structure.castle.health} / {player.structure.castle.maxHealth} HP
          </span>
        </div>
        <div className="stat">
          <span className="label">Gold:</span>
          <span className="value">{player.gold} / {player.maxGold}</span>
        </div>
        <div className="stat">
          <span className="label">Hand:</span>
          <span className="value">{player.hand.length}</span>
        </div>
        <div className="stat">
          <span className="label">Deck:</span>
          <span className="value">{player.deck.length}</span>
        </div>
      </div>

      {/* Structures */}
      <div className="structures">
        <h4>⚒️ Structures</h4>
        <div className="castle">
          <div className="castle-icon">🏰</div>
          <div className="structure-info">
            <div className="structure-name">Castle</div>
            <div className="structure-health">
              {player.structure.castle.health} / {player.structure.castle.maxHealth}
            </div>
          </div>
        </div>
        <div className="towers">
          {player.structure.towers.map((tower) => (
            <div
              key={tower.id}
              className={`tower ${tower.isDestroyed ? 'destroyed' : ''}`}
            >
              <div className="tower-icon">🗼</div>
              <div className="tower-info">
                <div className="tower-name">{tower.name}</div>
                <div className="tower-health">{tower.health} / {tower.maxHealth}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
