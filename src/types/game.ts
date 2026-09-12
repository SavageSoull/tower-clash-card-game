export interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'minion' | 'spell';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  description: string;
}

export interface Minion extends Card {
  type: 'minion';
  attack: number;
  health: number;
  hasAttackedThisTurn: boolean;
  canAttackThisTurn: boolean;
}

export interface Tower {
  id: string;
  name: string;
  maxHealth: number;
  health: number;
  effect: TowerEffect;
  isDestroyed: boolean;
}

export type TowerEffect = 'defense_boost' | 'spawn_minion' | 'none';

export interface Castle {
  maxHealth: number;
  health: number;
}

export interface PlayerStructure {
  castle: Castle;
  towers: Tower[];
}

export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  gold: number;
  maxGold: number;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  board: Minion[];
  structure: PlayerStructure;
  turnCount: number;
}

export interface GameState {
  player1: Player;
  player2: Player;
  currentPlayerTurn: 'player1' | 'player2';
  turnNumber: number;
  gameOver: boolean;
  winner: 'player1' | 'player2' | null;
}
