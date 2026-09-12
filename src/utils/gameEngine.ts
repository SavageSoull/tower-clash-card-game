import { GameState, Player, Minion, Card, PlayerStructure, Tower, Castle } from '../types/game';

// Initialize a new game state
export const initializeGame = (): GameState => {
  const player1 = createPlayer('player1', 'Player 1');
  const player2 = createPlayer('player2', 'Player 2');

  return {
    player1,
    player2,
    currentPlayerTurn: 'player1',
    turnNumber: 1,
    gameOver: false,
    winner: null,
  };
};

// Create a new player with initial state
const createPlayer = (id: string, name: string): Player => {
  return {
    id,
    name,
    health: 20, // Starting health
    maxHealth: 20,
    gold: 1,
    maxGold: 1,
    hand: generateStartingHand(),
    deck: generateDeck(),
    graveyard: [],
    board: [],
    structure: createPlayerStructure(),
    turnCount: 1,
  };
};

// Create player structures (castle + towers)
const createPlayerStructure = (): PlayerStructure => {
  const castle: Castle = {
    maxHealth: 30,
    health: 30,
  };

  const towers: Tower[] = [
    {
      id: 'tower_defense',
      name: 'Defense Tower',
      maxHealth: 15,
      health: 15,
      effect: 'defense_boost',
      isDestroyed: false,
    },
    {
      id: 'tower_spawn',
      name: 'Spawning Tower',
      maxHealth: 15,
      health: 15,
      effect: 'spawn_minion',
      isDestroyed: false,
    },
  ];

  return { castle, towers };
};

// Generate starting hand (5 cards)
const generateStartingHand = (): Card[] => {
  const hand: Card[] = [];
  for (let i = 0; i < 5; i++) {
    hand.push(createBasicMinion());
  }
  return hand;
};

// Generate initial deck
const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  for (let i = 0; i < 25; i++) {
    deck.push(createBasicMinion());
  }
  return deck;
};

// Create a basic minion card
const createBasicMinion = (): Minion => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Footsoldier',
    cost: 1,
    type: 'minion',
    rarity: 'common',
    description: 'A basic warrior',
    attack: 1,
    health: 1,
    hasAttackedThisTurn: false,
    canAttackThisTurn: false,
  };
};

// Play a card from hand to board
export const playCard = (
  gameState: GameState,
  cardIndex: number
): GameState => {
  const currentPlayer =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player1
      : gameState.player2;

  const card = currentPlayer.hand[cardIndex];

  if (!card || card.cost > currentPlayer.gold) {
    return gameState; // Can't play card
  }

  if (card.type === 'minion') {
    const minion = card as Minion;
    const newMinion: Minion = {
      ...minion,
      id: Math.random().toString(36).substr(2, 9),
      hasAttackedThisTurn: false,
      canAttackThisTurn: false, // Summoning sickness
    };

    const newHand = currentPlayer.hand.filter((_, i) => i !== cardIndex);
    const newGold = currentPlayer.gold - card.cost;
    const newBoard = [...currentPlayer.board, newMinion];

    const updatedPlayer = {
      ...currentPlayer,
      hand: newHand,
      gold: newGold,
      board: newBoard,
    };

    if (gameState.currentPlayerTurn === 'player1') {
      return { ...gameState, player1: updatedPlayer };
    } else {
      return { ...gameState, player2: updatedPlayer };
    }
  }

  return gameState;
};

// End turn and transition to next player
export const endTurn = (gameState: GameState): GameState => {
  const nextPlayer =
    gameState.currentPlayerTurn === 'player1' ? 'player2' : 'player1';
  const currentPlayer =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player1
      : gameState.player2;

  // Reset minions' attack status for next turn
  const updatedBoard = currentPlayer.board.map((minion) => ({
    ...minion,
    hasAttackedThisTurn: false,
    canAttackThisTurn: true, // Can attack next turn (unless just summoned)
  }));

  const updatedPlayer = {
    ...currentPlayer,
    board: updatedBoard,
  };

  // Draw a card for the next player
  const nextPlayerState =
    nextPlayer === 'player1' ? gameState.player1 : gameState.player2;
  const drawnCard = nextPlayerState.deck.pop();
  const newHand = drawnCard
    ? [...nextPlayerState.hand, drawnCard]
    : nextPlayerState.hand;

  // Increase gold for the next player (max 10)
  const newMaxGold = Math.min(nextPlayerState.maxGold + 1, 10);
  const newGold = newMaxGold;

  const nextPlayerUpdated = {
    ...nextPlayerState,
    hand: newHand,
    maxGold: newMaxGold,
    gold: newGold,
    turnCount: nextPlayerState.turnCount + 1,
  };

  const newGameState = {
    ...gameState,
    currentPlayerTurn: nextPlayer,
    turnNumber: gameState.turnNumber + 1,
  };

  if (nextPlayer === 'player1') {
    return { ...newGameState, player1: nextPlayerUpdated, player2: updatedPlayer };
  } else {
    return { ...newGameState, player1: updatedPlayer, player2: nextPlayerUpdated };
  }
};
