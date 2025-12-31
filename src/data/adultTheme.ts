// Adult theme - Deal or No Deal with money amounts
// Activities = Lower/bad amounts (things you don't want)
// Rewards = Higher/good amounts (things you want)
// Weight: 1-10 scale (1=worst/lowest, 10=best/highest)

export const ADULT_ACTIVITIES = [
  { text: '$0.01', weight: 1 },
  { text: '$1', weight: 1 },
  { text: '$5', weight: 1 },
  { text: '$10', weight: 1 },
  { text: '$25', weight: 2 },
  { text: '$50', weight: 2 },
  { text: '$75', weight: 2 },
  { text: '$100', weight: 2 },
  { text: '$200', weight: 3 },
  { text: '$300', weight: 3 },
  { text: '$400', weight: 3 },
  { text: '$500', weight: 3 },
  { text: '$600', weight: 4 },
  { text: '$700', weight: 4 },
  { text: '$750', weight: 4 },
  { text: '$800', weight: 4 },
  { text: '$900', weight: 4 },
  { text: '$1,000', weight: 5 },
  { text: '$1,500', weight: 5 },
  { text: '$2,000', weight: 5 },
];

export const ADULT_REWARDS = [
  { text: '$3,000', weight: 6 },
  { text: '$4,000', weight: 6 },
  { text: '$5,000', weight: 6 },
  { text: '$7,500', weight: 7 },
  { text: '$10,000', weight: 7 },
  { text: '$15,000', weight: 7 },
  { text: '$20,000', weight: 7 },
  { text: '$25,000', weight: 8 },
  { text: '$30,000', weight: 8 },
  { text: '$40,000', weight: 8 },
  { text: '$50,000', weight: 8 },
  { text: '$75,000', weight: 9 },
  { text: '$100,000', weight: 9 },
  { text: '$150,000', weight: 9 },
  { text: '$200,000', weight: 9 },
  { text: '$300,000', weight: 10 },
  { text: '$400,000', weight: 10 },
  { text: '$500,000', weight: 10 },
  { text: '$750,000', weight: 10 },
  { text: '$1,000,000', weight: 10 },
];

// Function to randomly select N activities (lower amounts)
export const selectRandomAdultActivities = (count: number = 4): { text: string; weight: number }[] => {
  const shuffled = [...ADULT_ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Function to randomly select N rewards (higher amounts)
export const selectRandomAdultRewards = (count: number = 3): { text: string; weight: number }[] => {
  const shuffled = [...ADULT_REWARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
