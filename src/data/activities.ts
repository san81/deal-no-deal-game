// 20 activities/tasks that kids need to perform
// Weight: 1-10 scale (1=easy/quick, 10=hard/time-consuming)
export const ACTIVITIES = [
  { text: '🤸 Do 10 jumping jacks', weight: 20 },
  { text: '📖 Tell us a story', weight: 40 },
  { text: '🍽️ Tell us a joke', weight: 50 },
  { text: '🧹 Show your dance move', weight: 70 },
  { text: '🐕 Make your funny pose', weight: 60 },
  { text: '📚 Give us a Riddle', weight: 80 },
  { text: '🧸 Describe your favorite person', weight: 40 },
  { text: '🌱 Share any vacation memories', weight: 20 },
  { text: '🗑️ Help with trash cleaning in this party', weight: 30 },
  { text: '🛏️ Play this game one more time', weight: 30 },
  { text: '🧺 Fold laundry', weight: 50 },
  { text: '🧽 Wipe kitchen table', weight: 20 },
  { text: '🚗 Vacuum the car', weight: 60 },
  { text: '📦 Do 10 sit ups', weight: 30 },
  { text: '🎒 Make a lap blind folded', weight: 30 },
  { text: '👕 Sing a song', weight: 40 },
  { text: '🪟 Share 3 things about your best friend', weight: 70 },
  { text: '🌳 Share 3 things you like about your parents', weight: 80 },
  { text: '🏃 Run 2 laps around house', weight: 50 },
  { text: '🧘 Practice 5 minutes meditation', weight: 40 },
];

// Function to randomly select N activities
export const selectRandomActivities = (count: number = 7): { text: string; weight: number }[] => {
  const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
