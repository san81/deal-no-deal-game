import React from 'react';
import { motion } from 'framer-motion';
import { Suitcase as SuitcaseType } from '../types/game.types';

interface SuitcaseProps {
  suitcase: SuitcaseType;
  onSelect?: () => void;
  disabled?: boolean;
  showContent?: boolean;
}

const Suitcase: React.FC<SuitcaseProps> = ({
  suitcase,
  onSelect,
  disabled,
  showContent,
}) => {
  const { id, item, isOpened, isPlayerCase } = suitcase;

  const handleClick = () => {
    if (!disabled && onSelect && !isOpened) {
      onSelect();
    }
  };

  return (
    <motion.div
      className="relative"
      whileHover={!disabled && !isOpened ? { scale: 1.1 } : {}}
      whileTap={!disabled && !isOpened ? { scale: 0.9 } : {}}
    >
      <motion.button
        onClick={handleClick}
        disabled={disabled || isOpened}
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-lg transition-all ${
          isOpened
            ? 'bg-gray-300 cursor-default'
            : isPlayerCase
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-2xl'
        } ${disabled && !isOpened ? 'opacity-50 cursor-not-allowed' : ''}`}
        initial={false}
        animate={isPlayerCase && !isOpened ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: isPlayerCase ? Infinity : 0, duration: 1.5 }}
      >
        {/* Case Number */}
        {!isOpened && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl mb-2">💼</div>
            <div className="text-3xl font-number font-bold text-white">{id}</div>
            {isPlayerCase && (
              <div className="text-sm text-white mt-1 font-bold">YOUR CASE</div>
            )}
          </div>
        )}

        {/* Opened Case - Show Content */}
        {isOpened && item && (showContent || true) && (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full p-2"
          >
            <div className={`text-4xl mb-1 ${item.isReward ? '🎁' : '📋'}`}>
              {item.isReward ? '🎁' : '📋'}
            </div>
            <div
              className={`text-xs md:text-sm text-center font-semibold ${
                item.isReward ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {item.text.substring(0, 20)}
              {item.text.length > 20 ? '...' : ''}
            </div>
          </motion.div>
        )}

        {/* Player Case - Final Reveal */}
        {isPlayerCase && !isOpened && showContent && item && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-4"
          >
            <div className="text-5xl mb-2">{item.isReward ? '🎉' : '📝'}</div>
            <div
              className={`text-sm text-center font-bold ${
                item.isReward ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {item.text}
            </div>
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Suitcase;
