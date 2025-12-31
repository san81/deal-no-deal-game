// 20 rewards for Girl theme
// Weight: 1-10 scale (1=small treat, 10=big ticket item)
export const GIRL_REWARDS = [
  { text: '🍫 Chocolate bar', weight: 2 },
  { text: '🍦 Ice cream', weight: 3 },
  { text: '💎 Twix', weight: 8 },
  { text: '🎀 Lego set', weight: 5 },
  { text: '🎨 Art supplies kit', weight: 7 },
  { text: '🍕 Choose favorite dinner', weight: 4 },
  { text: '👭 Sleepover with friend pass', weight: 8 },
  { text: '💅 Nail polish set', weight: 5 },
  { text: '📚 New book of choice', weight: 6 },
  { text: '🧸 Stuffed animal', weight: 5 },
  { text: '🎀 Dress-up costume', weight: 7 },
  { text: '🌸 Flower crown making kit', weight: 6 },
  { text: '💄 Kids makeup set', weight: 7 },
  { text: '🎭 Theater/show tickets', weight: 9 },
  { text: '🍰 Baking cookies together', weight: 5 },
  { text: '🎪 Trip to zoo/aquarium', weight: 8 },
  { text: '🦄 Unicorn blanket', weight: 6 },
  { text: '📱 Phone case decoration kit', weight: 6 },
  { text: '🎵 Karaoke session', weight: 6 },
  { text: '🏖️ Beach day trip', weight: 9 },
];

// Function to randomly select N rewards
export const selectRandomGirlRewards = (count: number = 7): { text: string; weight: number }[] => {
  const shuffled = [...GIRL_REWARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
