/**
 * Generate dynamic dollar amounts for adult theme based on number of players and multiplier
 * Formula: maxAmount = numberOfPlayers × multiplier
 */

export const generateAdultAmounts = (
  numberOfPlayers: number,
  multiplier: number
): { activities: { text: string; weight: number }[]; rewards: { text: string; weight: number }[] } => {
  const maxAmount = numberOfPlayers * multiplier;

  // Generate 20 activities (lower amounts - weights 1-5)
  const activities: { text: string; weight: number }[] = [];
  const activityStep = maxAmount * 0.15; // First 15% of range for activities

  for (let i = 0; i < 20; i++) {
    const amount = Math.round((activityStep / 20) * (i + 1) * 100) / 100;
    activities.push({
      text: formatCurrency(amount),
      weight: Math.ceil((i / 20) * 5) || 1, // Distribute weights 1-5
    });
  }

  // Generate 20 rewards (higher amounts - weights 6-10)
  const rewards: { text: string; weight: number }[] = [];
  const rewardStart = activityStep;
  const rewardRange = maxAmount - rewardStart;

  for (let i = 0; i < 20; i++) {
    const amount = Math.round((rewardStart + (rewardRange / 20) * (i + 1)) * 100) / 100;
    rewards.push({
      text: formatCurrency(amount),
      weight: Math.ceil(6 + (i / 20) * 4), // Distribute weights 6-10
    });
  }

  return { activities, rewards };
};

/**
 * Format number as currency
 */
const formatCurrency = (amount: number): string => {
  if (amount < 1) {
    return `$${amount.toFixed(2)}`;
  } else if (amount < 1000) {
    return `$${Math.round(amount)}`;
  } else if (amount < 1000000) {
    return `$${(amount / 1000).toFixed(1)}K`.replace('.0K', 'K');
  } else {
    return `$${(amount / 1000000).toFixed(2)}M`.replace('.00M', 'M');
  }
};

/**
 * Select random items from generated amounts
 */
export const selectRandomAdultAmounts = (
  amounts: { text: string; weight: number }[],
  count: number
): { text: string; weight: number }[] => {
  const shuffled = [...amounts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
