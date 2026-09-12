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
      <div className="player-name">{player.name}</div>
      
      <div className="player-stats">
        <div className="stat">
          <span className="label">Castle HP:</span>
          <span className="value">
            {player.structure.castle.health} / {player.structure.castle.maxHealth}
          </span>
        </div>
        <div className="stat">
          <span className="label">Gold:</span>
          <span className="value">{player.gold} / {player.maxGold}</span>
        </div>
        <div className="stat">
          <span className="label">Hand:</span>
          <span className="value">{player.hand.length} cards</span>
        </div>
      </div>

      <div className="structures">
        <h4>Structures</h4>
        <div className="castle">
          <div className="castle-name">Castle</div>
          <div className="castle-health">
            {player.structure.castle.health} HP
          </div>
        </div>
        <div className="towers">
          {player.structure.towers.map((tower) => (
            <div
              key={tower.id}
              className={`tower ${tower.isDestroyed ? 'destroyed' : ''}`}
            >
              <div className="tower-name">{tower.name}</div>
              <div className="tower-health">{tower.health} HP</div>
            </div>
          ))}
        </div>
      </div>

      <div className="board">
        <h4>Board ({player.board.length} minions)</h4>
        <div className="minion-list">
          {player.board.map((minion) => (
            <div key={minion.id} className="minion-card">
              <div className="minion-name">{minion.name}</div>
              <div className="minion-stats">
                <span className="attack">{minion.attack}⚔️</span>
                <span className="health">{minion.health}❤️</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
