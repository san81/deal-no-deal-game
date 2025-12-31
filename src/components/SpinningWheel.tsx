import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKids } from '../context/KidContext';
import {
  calculateWheelRotation,
  getRandomSpinDuration,
  selectRandomKid,
  wheelEasing,
} from '../utils/wheelPhysics';
import { WHEEL_COLORS } from '../types/theme.types';
import confetti from 'canvas-confetti';
import { useSound } from '../hooks/useSound';

interface SpinningWheelProps {
  onKidSelected: (kidName: string) => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ onKidSelected }) => {
  const { kidState } = useKids();
  const { playSound } = useSound();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(0);
  const [selectedKid, setSelectedKid] = useState<string | null>(null);

  const kidNames = kidState.remainingKids.map((k) => k.name);

  const handleSpin = () => {
    if (isSpinning || kidNames.length === 0) return;

    setIsSpinning(true);
    setSelectedKid(null);

    // Select random kid
    const { index, name } = selectRandomKid(kidNames);
    const duration = getRandomSpinDuration();

    // Calculate where the segment center currently is
    const degreesPerSegment = 360 / kidNames.length;
    const currentPosition = rotation % 360; // Normalize current rotation to 0-360
    const segmentCenter = (index + 0.5) * degreesPerSegment - 90; // Initial position of segment
    const currentSegmentPosition = (segmentCenter + currentPosition) % 360; // Where segment is now

    // Pointer is at -90 degrees (which is same as 270 degrees)
    const pointerPosition = 270;

    // Calculate rotation needed to bring segment to pointer
    let rotationNeeded = pointerPosition - currentSegmentPosition;

    // Ensure we rotate forward (positive direction)
    while (rotationNeeded < 0) {
      rotationNeeded += 360;
    }

    // Add 3-5 full rotations for excitement (must be whole number)
    const extraRotations = Math.floor(3 + Math.random() * 3); // 3, 4, or 5
    const totalRotationToAdd = extraRotations * 360 + rotationNeeded;

    // Calculate new total rotation
    const newRotation = rotation + totalRotationToAdd;

    setSpinDuration(duration);
    setRotation(newRotation);

    // Play spinning wheel sound in loop
    const spinAudio = playSound('spin', true);

    // After spin completes
    setTimeout(() => {
      // Stop the looping spin sound
      if (spinAudio && spinAudio instanceof HTMLAudioElement) {
        spinAudio.pause();
        spinAudio.currentTime = 0;
      }

      setIsSpinning(false);
      setSelectedKid(name);

      // Play winner announcement fanfare
      playSound('wheel-winner');

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: WHEEL_COLORS,
      });

      // No automatic transition - user clicks button to proceed
    }, duration * 1000);
  };

  const renderWheel = () => {
    const segmentCount = kidNames.length;
    const anglePerSegment = 360 / segmentCount;
    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    return (
      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
        <g transform={`translate(${centerX}, ${centerY})`}>
          {kidNames.map((name, index) => {
            const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);

            const x1 = radius * Math.cos(startAngle);
            const y1 = radius * Math.sin(startAngle);
            const x2 = radius * Math.cos(endAngle);
            const y2 = radius * Math.sin(endAngle);

            const textAngle = ((index + 0.5) * anglePerSegment - 90) * (Math.PI / 180);
            const textRadius = radius * 0.65;
            const textX = textRadius * Math.cos(textAngle);
            const textY = textRadius * Math.sin(textAngle);
            const textRotation = (index + 0.5) * anglePerSegment;

            const color = WHEEL_COLORS[index % WHEEL_COLORS.length];

            return (
              <g key={name}>
                {/* Segment */}
                <path
                  d={`M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                  fill={color}
                  stroke="white"
                  strokeWidth="3"
                />

                {/* Text */}
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  className="font-heading"
                >
                  {name}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx="0" cy="0" r="30" fill="white" stroke="#333" strokeWidth="3" />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            className="font-heading"
          >
            🎪
          </text>
        </g>
      </svg>
    );
  };

  if (kidNames.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-heading mb-4">No kids remaining!</h2>
          <p>Please add more kids or reset the game.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <motion.h1
        className="text-5xl md:text-6xl font-heading text-white text-center mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        🎯 Spin the Wheel! 🎯
      </motion.h1>

      {/* Pointer */}
      <div className="relative mb-4">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-6xl">👇</div>
        </div>

        {/* Wheel Container */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: spinDuration,
            ease: wheelEasing,
          }}
          className="relative"
        >
          {renderWheel()}
        </motion.div>
      </div>

      {/* Result Card - Below the Wheel */}
      {selectedKid && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 mb-4"
        >
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: 2,
                duration: 0.5,
              }}
            >
              <h2 className="text-5xl font-heading mb-2">
                🎉 🎊 🎉
              </h2>
              <h1 className="text-4xl md:text-5xl font-heading text-primary-orange mb-2">
                {selectedKid.toUpperCase()}
              </h1>
              <p className="text-2xl font-heading text-gray-700">
                IS UP!
              </p>
              <h2 className="text-5xl font-heading mt-2">
                🎊 🎉 🎊
              </h2>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Spin Button or Continue Button */}
      {!selectedKid ? (
        <>
          <motion.button
            onClick={handleSpin}
            disabled={isSpinning}
            whileHover={!isSpinning ? { scale: 1.1 } : {}}
            whileTap={!isSpinning ? { scale: 0.9 } : {}}
            className={`mt-8 px-12 py-4 text-2xl font-heading rounded-2xl shadow-2xl transition-all ${
              isSpinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-yellow to-primary-orange text-white hover:shadow-3xl'
            }`}
          >
            {isSpinning ? '🎡 Spinning...' : '🎯 SPIN THE WHEEL!'}
          </motion.button>

          <p className="text-white text-center mt-6 text-lg">
            {kidNames.length} {kidNames.length === 1 ? 'kid' : 'kids'} remaining
          </p>
        </>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => onKidSelected(selectedKid)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-8 px-12 py-4 text-2xl font-heading rounded-2xl shadow-2xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-3xl"
        >
          ✅ Continue to Theme Selection
        </motion.button>
      )}
    </motion.div>
  );
};

export default SpinningWheel;
