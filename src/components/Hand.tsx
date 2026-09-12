import React from 'react';
import { Card } from '../types/game';
import './Hand.css';

interface HandProps {
  hand: Card[];
  gold: number;
  onPlayCard: (cardIndex: number) => void;
}

const Hand: React.FC<HandProps> = ({ hand, gold, onPlayCard }) => {
  const canAfford = (cardCost: number) => cardCost <= gold;

  return (
    <div className="hand">
      <div className="hand-header">
        <h3>🃏 Hand</h3>
        <span className="gold-counter">💰 {gold}</span>
      </div>
      <div className="hand-cards">
        {hand.length === 0 ? (
          <p className="empty-hand">No cards</p>
        ) : (
          hand.map((card, index) => (
            <div
              key={index}
              className={`card ${
                canAfford(card.cost) ? 'playable' : 'unaffordable'
              }`}
            >
              <div className="card-header">
                <span className="card-name">{card.name}</span>
                <span className="card-cost">{card.cost}</span>
              </div>
              <div className="card-description">{card.description}</div>
              {card.type === 'minion' && (
                <div className="card-stats">
                  <span className="stat-attack">⚔️ {(card as any).attack}</span>
                  <span className="stat-health">❤️ {(card as any).health}</span>
                </div>
              )}
              <button
                className="btn-play"
                onClick={() => onPlayCard(index)}
                disabled={!canAfford(card.cost)}
                title={!canAfford(card.cost) ? `Need ${card.cost} gold (have ${gold})` : 'Click to play'}
              >
                Play
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Hand;
