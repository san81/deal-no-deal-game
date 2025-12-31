// 20 rewards for Boy theme
// Weight: 1-10 scale (1=small treat, 10=big ticket item)
export const BOY_REWARDS = [
  { text: '🍫 Chocolate bar', weight: 2 },
  { text: '🍦 Ice cream', weight: 3 },
  { text: '🎮 M & M s', weight: 6 },
  { text: '📺 Extra screen time (30 min)', weight: 4 },
  { text: '🎬 Pick movie night film', weight: 3 },
  { text: '🍕 Choose favorite dinner', weight: 4 },
  { text: '🌙 Stay up late pass (30 min)', weight: 5 },
  { text: '🎯 Kitkat bar', weight: 7 },
  { text: '🏀 Basketball game with dad', weight: 6 },
  { text: '🎮 Twix', weight: 9 },
  { text: '🍩 Donut breakfast', weight: 3 },
  { text: '⚽ Soccer ball', weight: 5 },
  { text: '🎨 LEGO set', weight: 8 },
  { text: '🏊 Pool day with friends', weight: 7 },
  { text: '🍔 Fast food meal pick', weight: 4 },
  { text: '🎪 Trip to arcade', weight: 8 },
  { text: '🚴 Bike ride adventure', weight: 5 },
  { text: '🎵 Download favorite songs', weight: 4 },
  { text: '🏕️ Camping in backyard', weight: 7 },
  { text: '🤖 RC car toy', weight: 8 },
];

// Function to randomly select N rewards
export const selectRandomBoyRewards = (count: number = 7): { text: string; weight: number }[] => {
  const shuffled = [...BOY_REWARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
