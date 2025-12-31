import { GameItem } from '../types/game.types';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Selects random items from an array
 */
export const selectRandomItems = <T>(items: T[], count: number): T[] => {
  const shuffled = shuffleArray(items);
  return shuffled.slice(0, Math.min(count, items.length));
};

/**
 * Creates GameItem objects from items with text and weight
 */
export const createGameItems = (
  items: { text: string; weight: number }[],
  isReward: boolean
): GameItem[] => {
  return items.map((item, index) => ({
    id: `${isReward ? 'reward' : 'activity'}-${index}`,
    text: item.text,
    weight: item.weight,
    isReward,
    isRevealed: false,
  }));
};

/**
 * Combines and shuffles activities and rewards for suitcases
 */
export const createShuffledGameItems = (
  activities: { text: string; weight: number }[],
  rewards: { text: string; weight: number }[]
): GameItem[] => {
  const activityItems = createGameItems(activities, false);
  const rewardItems = createGameItems(rewards, true);
  const allItems = [...activityItems, ...rewardItems];
  return shuffleArray(allItems);
};
