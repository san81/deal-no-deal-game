// 20 rewards for Boy theme
export const BOY_REWARDS = [
  '🍫 Chocolate bar',
  '🍦 Ice cream sundae',
  '🎮 Roblox gift card $10',
  '📺 Extra screen time (30 min)',
  '🎬 Pick movie night film',
  '🍕 Choose favorite dinner',
  '🌙 Stay up late pass (30 min)',
  '🎯 Nerf gun set',
  '🏀 Basketball game with dad',
  '🎮 New video game',
  '🍩 Donut breakfast',
  '⚽ Soccer ball',
  '🎨 LEGO set',
  '🏊 Pool day with friends',
  '🍔 Fast food meal pick',
  '🎪 Trip to arcade',
  '🚴 Bike ride adventure',
  '🎵 Download favorite songs',
  '🏕️ Camping in backyard',
  '🤖 RC car toy',
];

// Function to randomly select N rewards
export const selectRandomBoyRewards = (count: number = 7): string[] => {
  const shuffled = [...BOY_REWARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
