import React, { createContext, useContext, type ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';

type GameContextValue = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const game = useGameState();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
