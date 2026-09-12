import { GameState, Player, Minion, Card, PlayerStructure, Tower, Castle } from '../types/game';

// Initialize a new game state
export const initializeGame = (): GameState => {
  const player1 = createPlayer('player1', 'Player');
  const player2 = createPlayer('player2', 'Computer');

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
    health: 20,
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
    return gameState;
  }

  if (card.type === 'minion') {
    const minion = card as Minion;
    const newMinion: Minion = {
      ...minion,
      id: Math.random().toString(36).substr(2, 9),
      hasAttackedThisTurn: false,
      canAttackThisTurn: false,
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

// Attack with a minion
export const attackWithMinion = (
  gameState: GameState,
  minionId: string,
  targetType: 'minion' | 'tower' | 'castle',
  targetId?: string
): GameState => {
  const currentPlayer =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player1
      : gameState.player2;
  const opponent =
    gameState.currentPlayerTurn === 'player1'
      ? gameState.player2
      : gameState.player1;

  // Find attacker minion
  const attackerIndex = currentPlayer.board.findIndex((m) => m.id === minionId);
  if (attackerIndex === -1) return gameState;

  const attacker = currentPlayer.board[attackerIndex];

  // Check if minion can attack
  if (attacker.hasAttackedThisTurn || !attacker.canAttackThisTurn) {
    return gameState;
  }

  let newGameState = { ...gameState };
  const updatedCurrentPlayer = { ...currentPlayer };
  const updatedOpponent = { ...opponent };

  if (targetType === 'minion' && targetId) {
    // Attack enemy minion
    const defenderIndex = opponent.board.findIndex((m) => m.id === targetId);
    if (defenderIndex === -1) return gameState;

    const defender = opponent.board[defenderIndex];

    // Deal damage both ways
    attacker.health -= defender.attack;
    defender.health -= attacker.attack;

    // Remove dead minions
    const newAttackerBoard = updatedCurrentPlayer.board.filter((m) => m.health > 0);
    const newDefenderBoard = updatedOpponent.board.filter((m) => m.health > 0);

    updatedCurrentPlayer.board = newAttackerBoard;
    updatedOpponent.board = newDefenderBoard;
  } else if (targetType === 'tower') {
    // Attack tower
    const tower = updatedOpponent.structure.towers.find((t) => t.id === targetId);
    if (!tower) return gameState;

    tower.health -= attacker.attack;
    if (tower.health <= 0) {
      tower.isDestroyed = true;
    }
  } else if (targetType === 'castle') {
    // Attack castle
    updatedOpponent.structure.castle.health -= attacker.attack;
  }

  // Mark minion as attacked
  const updatedMinionIndex = updatedCurrentPlayer.board.findIndex(
    (m) => m.id === minionId
  );
  if (updatedMinionIndex !== -1) {
    updatedCurrentPlayer.board[updatedMinionIndex].hasAttackedThisTurn = true;
  }

  // Update game state
  if (gameState.currentPlayerTurn === 'player1') {
    newGameState = { ...newGameState, player1: updatedCurrentPlayer, player2: updatedOpponent };
  } else {
    newGameState = { ...newGameState, player1: updatedOpponent, player2: updatedCurrentPlayer };
  }

  // Check for game over
  if (updatedOpponent.structure.castle.health <= 0) {
    newGameState.gameOver = true;
    newGameState.winner = gameState.currentPlayerTurn;
  }

  return newGameState;
};

// AI: Simple computer turn logic
export const computerTurn = (gameState: GameState): GameState => {
  let newGameState = { ...gameState };
  const computer = newGameState.player2;
  const player = newGameState.player1;

  // Play cards randomly if affordable
  let cardsPlayed = 0;
  for (let i = 0; i < computer.hand.length && cardsPlayed < 2; i++) {
    const card = computer.hand[i];
    if (card.cost <= computer.gold && Math.random() > 0.5) {
      newGameState = playCard(newGameState, i);
      cardsPlayed++;
    }
  }

  // Attack with minions - target player's castle if no minions
  const computerMinions = newGameState.player2.board;
  for (const minion of computerMinions) {
    if (!minion.hasAttackedThisTurn && minion.canAttackThisTurn) {
      // Try to attack enemy minions first
      if (player.board.length > 0) {
        const targetMinion = player.board[Math.floor(Math.random() * player.board.length)];
        newGameState = attackWithMinion(newGameState, minion.id, 'minion', targetMinion.id);
      } else if (player.structure.towers.some((t) => !t.isDestroyed)) {
        // Attack towers if no minions
        const activeTowers = player.structure.towers.filter((t) => !t.isDestroyed);
        const targetTower = activeTowers[Math.floor(Math.random() * activeTowers.length)];
        newGameState = attackWithMinion(newGameState, minion.id, 'tower', targetTower.id);
      } else {
        // Attack castle if no towers
        newGameState = attackWithMinion(newGameState, minion.id, 'castle');
      }
    }
  }

  // End turn
  newGameState = endTurn(newGameState);
  return newGameState;
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
    canAttackThisTurn: true,
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
