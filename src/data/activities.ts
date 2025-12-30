// 20 activities/tasks that kids need to perform
export const ACTIVITIES = [
  '🤸 Do 10 jumping jacks',
  '📖 Read for 15 minutes',
  '🍽️ Help with dishes',
  '🧹 Clean your room',
  '🐕 Walk the dog',
  '📚 Complete homework',
  '🧸 Organize toys',
  '🌱 Water the plants',
  '🗑️ Take out trash',
  '🛏️ Make your bed',
  '🧺 Fold laundry',
  '🧽 Wipe kitchen table',
  '🚗 Vacuum the car',
  '📦 Sort recycling',
  '🎒 Organize backpack',
  '👕 Put away clothes',
  '🪟 Clean windows',
  '🌳 Rake leaves',
  '🏃 Run 2 laps around house',
  '🧘 Practice 5 minutes meditation',
];

// Function to randomly select N activities
export const selectRandomActivities = (count: number = 7): string[] => {
  const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
