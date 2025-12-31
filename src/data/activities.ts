// 20 activities/tasks that kids need to perform
// Weight: 1-10 scale (1=easy/quick, 10=hard/time-consuming)
export const ACTIVITIES = [
  { text: '🤸 Do 10 jumping jacks', weight: 2 },
  { text: '📖 Tell us a story', weight: 4 },
  { text: '🍽️ Tell us a joke', weight: 5 },
  { text: '🧹 Show your dance move', weight: 7 },
  { text: '🐕 Make your funny pose', weight: 6 },
  { text: '📚 Give us a Riddle', weight: 8 },
  { text: '🧸 Describe your favorite person', weight: 4 },
  { text: '🌱 Share any vacation memories', weight: 2 },
  { text: '🗑️ Help with trash cleaning in this party', weight: 3 },
  { text: '🛏️ Play this game one more time', weight: 3 },
  { text: '🧺 Fold laundry', weight: 5 },
  { text: '🧽 Wipe kitchen table', weight: 2 },
  { text: '🚗 Vacuum the car', weight: 6 },
  { text: '📦 Do 10 sit ups', weight: 3 },
  { text: '🎒 Make a lap blind folded', weight: 3 },
  { text: '👕 Sing a song', weight: 4 },
  { text: '🪟 Share 3 things about your best friend', weight: 7 },
  { text: '🌳 Share 3 things you like about your parents', weight: 8 },
  { text: '🏃 Run 2 laps around house', weight: 5 },
  { text: '🧘 Practice 5 minutes meditation', weight: 4 },
];

// Function to randomly select N activities
export const selectRandomActivities = (count: number = 7): { text: string; weight: number }[] => {
  const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
