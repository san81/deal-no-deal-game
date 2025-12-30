import { Kid } from '../types/kid.types';

const STORAGE_KEY = 'kidGameState';

export interface StoredGameState {
  kids: Kid[];
  timestamp: number;
}

/**
 * Save kids data to localStorage
 */
export const saveKidsToStorage = (kids: Kid[]): void => {
  try {
    const data: StoredGameState = {
      kids,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load kids data from localStorage
 */
export const loadKidsFromStorage = (): Kid[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StoredGameState = JSON.parse(stored);

    // Check if data is less than 24 hours old
    const isRecent = Date.now() - data.timestamp < 24 * 60 * 60 * 1000;

    return isRecent ? data.kids : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Clear kids data from localStorage
 */
export const clearKidsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
