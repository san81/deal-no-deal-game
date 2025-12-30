import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GamePhase, Theme, Suitcase, GameItem } from '../types/game.types';
import { selectRandomActivities } from '../data/activities';
import { selectRandomBoyRewards } from '../data/boyTheme';
import { selectRandomGirlRewards } from '../data/girlTheme';
import { createShuffledGameItems } from '../utils/randomSelection';

interface GameContextType {
  state: GameState;
  setPhase: (phase: GamePhase) => void;
  selectTheme: (theme: Theme) => void;
  selectPlayerCase: (caseId: number) => void;
  openCase: (caseId: number) => void;
  acceptBankerOffer: (activity: GameItem) => void;
  declineBankerOffer: () => void;
  acceptSwap: () => void;
  declineSwap: () => void;
  openFinalCase: () => void;
  resetGame: () => void;
  startNewGame: (theme?: Theme) => void;
}

type GameAction =
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SELECT_THEME'; payload: Theme }
  | { type: 'SELECT_PLAYER_CASE'; payload: number }
  | { type: 'OPEN_CASE'; payload: number }
  | { type: 'ACCEPT_BANKER_OFFER'; payload: GameItem }
  | { type: 'DECLINE_BANKER_OFFER' }
  | { type: 'ACCEPT_SWAP' }
  | { type: 'DECLINE_SWAP' }
  | { type: 'OPEN_FINAL_CASE' }
  | { type: 'RESET_GAME' }
  | { type: 'START_NEW_GAME'; payload?: Theme };

const initialState: GameState = {
  phase: 'kid-setup',
  theme: null,
  suitcases: [],
  activities: [],
  rewards: [],
  playerCaseId: null,
  openedCases: [],
  bankerOfferCount: 0,
  swapOffered: false,
  swapAccepted: false,
  originalCaseId: null,
  result: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'SELECT_THEME': {
      const theme = action.payload;
      // Always select exactly 4 activities and 3 rewards
      const activities = selectRandomActivities(4);
      const rewards =
        theme === 'boy'
          ? selectRandomBoyRewards(3)
          : selectRandomGirlRewards(3);

      const gameItems = createShuffledGameItems(activities, rewards);

      // Create 7 suitcases with the 7 game items
      const suitcases: Suitcase[] = Array.from({ length: 7 }, (_, index) => ({
        id: index + 1,
        item: gameItems[index],
        isOpened: false,
        isPlayerCase: false,
      }));

      return {
        ...initialState, // Reset to initial state for new game
        theme,
        suitcases,
        activities: gameItems.filter((item) => !item.isReward),
        rewards: gameItems.filter((item) => item.isReward),
        phase: 'case-selection',
      };
    }

    case 'SELECT_PLAYER_CASE': {
      const updatedSuitcases = state.suitcases.map((suitcase) => ({
        ...suitcase,
        isPlayerCase: suitcase.id === action.payload,
      }));

      return {
        ...state,
        suitcases: updatedSuitcases,
        playerCaseId: action.payload,
        originalCaseId: action.payload,
        phase: 'opening-cases',
      };
    }

    case 'OPEN_CASE': {
      const caseId = action.payload;
      const updatedSuitcases = state.suitcases.map((suitcase) =>
        suitcase.id === caseId ? { ...suitcase, isOpened: true } : suitcase
      );

      const openedCase = updatedSuitcases.find((s) => s.id === caseId);
      if (openedCase?.item) {
        openedCase.item.isRevealed = true;
      }

      const newOpenedCases = [...state.openedCases, caseId];

      // Check for banker offer conditions
      let newPhase: GamePhase = 'opening-cases';
      let newBankerCount = state.bankerOfferCount;

      if (newOpenedCases.length === 3 && state.bankerOfferCount === 0) {
        newPhase = 'banker-ready';
        newBankerCount = 1;
      } else if (newOpenedCases.length === 5 && state.bankerOfferCount === 1) {
        newPhase = 'banker-ready';
        newBankerCount = 2;
      }
      // Note: Swap offer now triggers after 2nd banker offer is handled, not here

      return {
        ...state,
        suitcases: updatedSuitcases,
        openedCases: newOpenedCases,
        phase: newPhase,
        bankerOfferCount: newBankerCount,
      };
    }

    case 'ACCEPT_BANKER_OFFER':
      return {
        ...state,
        phase: 'game-result',
        result: {
          kidName: '', // Will be set by KidContext
          item: action.payload,
          wasSwapped: false,
          acceptedBankerOffer: true,
        },
      };

    case 'DECLINE_BANKER_OFFER':
      // After 2nd banker offer (5 cases opened), trigger swap instead of continuing
      const shouldTriggerSwap = state.openedCases.length === 5 && state.bankerOfferCount === 2;
      return {
        ...state,
        phase: shouldTriggerSwap ? 'swap-offer' : 'opening-cases',
      };

    case 'ACCEPT_SWAP': {
      // Find the other unopened case (not player's case)
      const otherCase = state.suitcases.find(
        (s) => !s.isOpened && s.id !== state.playerCaseId
      );

      if (!otherCase) return state;

      // Swap: player gets the other case (keep it closed for now)
      const updatedSuitcases = state.suitcases.map((suitcase) => {
        if (suitcase.id === otherCase.id) {
          // This is the swapped case - mark as player's case but keep closed
          return {
            ...suitcase,
            isPlayerCase: true,
          };
        }
        // Mark all other cases as not player's case
        return {
          ...suitcase,
          isPlayerCase: false,
        };
      });

      return {
        ...state,
        suitcases: updatedSuitcases,
        playerCaseId: otherCase.id,
        swapAccepted: true,
        swapOffered: true,
        phase: 'final-reveal',
      };
    }

    case 'DECLINE_SWAP': {
      // Player keeps their original case (keep it closed for now)
      return {
        ...state,
        swapOffered: true,
        swapAccepted: false,
        phase: 'final-reveal',
      };
    }

    case 'OPEN_FINAL_CASE': {
      // Open and reveal the player's final case
      const updatedSuitcases = state.suitcases.map((suitcase) => {
        if (suitcase.id === state.playerCaseId && suitcase.item) {
          return {
            ...suitcase,
            isOpened: true,
            item: { ...suitcase.item, isRevealed: true },
          };
        }
        return suitcase;
      });

      const playerCase = updatedSuitcases.find((s) => s.id === state.playerCaseId);

      return {
        ...state,
        suitcases: updatedSuitcases,
        phase: 'game-result',
        result: {
          kidName: '', // Will be set by KidContext
          item: playerCase?.item || null,
          wasSwapped: state.swapAccepted,
          acceptedBankerOffer: false,
        },
      };
    }

    case 'RESET_GAME':
      return initialState;

    case 'START_NEW_GAME': {
      const theme = action.payload || state.theme;
      if (!theme) return initialState;

      // Always select exactly 4 activities and 3 rewards
      const activities = selectRandomActivities(4);
      const rewards =
        theme === 'boy'
          ? selectRandomBoyRewards(3)
          : selectRandomGirlRewards(3);

      const gameItems = createShuffledGameItems(activities, rewards);

      const suitcases: Suitcase[] = Array.from({ length: 7 }, (_, index) => ({
        id: index + 1,
        item: gameItems[index],
        isOpened: false,
        isPlayerCase: false,
      }));

      return {
        ...initialState,
        theme,
        suitcases,
        activities: gameItems.filter((item) => !item.isReward),
        rewards: gameItems.filter((item) => item.isReward),
        phase: 'case-selection',
      };
    }

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPhase = (phase: GamePhase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  };

  const selectTheme = (theme: Theme) => {
    dispatch({ type: 'SELECT_THEME', payload: theme });
  };

  const selectPlayerCase = (caseId: number) => {
    dispatch({ type: 'SELECT_PLAYER_CASE', payload: caseId });
  };

  const openCase = (caseId: number) => {
    dispatch({ type: 'OPEN_CASE', payload: caseId });
  };

  const acceptBankerOffer = (activity: GameItem) => {
    dispatch({ type: 'ACCEPT_BANKER_OFFER', payload: activity });
  };

  const declineBankerOffer = () => {
    dispatch({ type: 'DECLINE_BANKER_OFFER' });
  };

  const acceptSwap = () => {
    dispatch({ type: 'ACCEPT_SWAP' });
  };

  const declineSwap = () => {
    dispatch({ type: 'DECLINE_SWAP' });
  };

  const openFinalCase = () => {
    dispatch({ type: 'OPEN_FINAL_CASE' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const startNewGame = (theme?: Theme) => {
    dispatch({ type: 'START_NEW_GAME', payload: theme });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setPhase,
        selectTheme,
        selectPlayerCase,
        openCase,
        acceptBankerOffer,
        declineBankerOffer,
        acceptSwap,
        declineSwap,
        openFinalCase,
        resetGame,
        startNewGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
