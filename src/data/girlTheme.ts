// 20 rewards for Girl theme
export const GIRL_REWARDS = [
  '🍫 Chocolate bar',
  '🍦 Ice cream sundae',
  '💎 Pendant necklace',
  '🎀 Hair accessories set',
  '🎨 Art supplies kit',
  '🍕 Choose favorite dinner',
  '👭 Sleepover with friend pass',
  '💅 Nail polish set',
  '📚 New book of choice',
  '🧸 Stuffed animal',
  '🎀 Dress-up costume',
  '🌸 Flower crown making kit',
  '💄 Kids makeup set',
  '🎭 Theater/show tickets',
  '🍰 Baking cookies together',
  '🎪 Trip to zoo/aquarium',
  '🦄 Unicorn blanket',
  '📱 Phone case decoration kit',
  '🎵 Karaoke session',
  '🏖️ Beach day trip',
];

// Function to randomly select N rewards
export const selectRandomGirlRewards = (count: number = 7): string[] => {
  const shuffled = [...GIRL_REWARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
