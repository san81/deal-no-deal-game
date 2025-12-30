/**
 * Calculate the rotation needed to land on a specific segment
 */
export const calculateWheelRotation = (
  totalSegments: number,
  targetIndex: number
): number => {
  // Calculate degrees per segment
  const degreesPerSegment = 360 / totalSegments;

  // Segments are drawn with first segment starting at -90 degrees (top of wheel)
  // Segment i has center at: (i + 0.5) * degreesPerSegment - 90
  // Pointer is at -90 degrees (top, pointing down)
  // To align segment i's center with pointer: rotate by -(i + 0.5) * degreesPerSegment
  // For clockwise (positive) rotation: add 360
  const targetAngle = 360 - degreesPerSegment * (targetIndex + 0.5);

  // Add 3-5 full rotations for excitement
  const extraRotations = 3 + Math.random() * 2;
  const totalRotation = extraRotations * 360 + targetAngle;

  return totalRotation;
};

/**
 * Get random spin duration (4-6 seconds)
 */
export const getRandomSpinDuration = (): number => {
  return 4 + Math.random() * 2; // 4-6 seconds
};

/**
 * Get random number of extra rotations (must be integer for accuracy)
 */
export const getRandomExtraRotations = (): number => {
  return Math.floor(3 + Math.random() * 3); // 3, 4, or 5 full rotations
};

/**
 * Custom easing function for realistic wheel spin
 * Fast start, gradual deceleration, no overshoot
 * Using ease-out-cubic for smooth deceleration
 */
export const wheelEasing = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Select random kid from array
 */
export const selectRandomKid = (kids: string[]): { index: number; name: string } => {
  const index = Math.floor(Math.random() * kids.length);
  return {
    index,
    name: kids[index],
  };
};
