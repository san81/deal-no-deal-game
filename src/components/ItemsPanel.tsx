import React from 'react';
import { motion } from 'framer-motion';
import { GameItem } from '../types/game.types';

interface ItemsPanelProps {
  title: string;
  items: GameItem[];
  isReward: boolean;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({ title, items, isReward }) => {
  // Sort items by weight (ascending order)
  const sortedItems = [...items].sort((a, b) => a.weight - b.weight);

  return (
    <div
      className={`bg-white/95 backdrop-blur rounded-2xl shadow-xl p-3 md:p-4 ${
        isReward ? 'border-4 border-green-400' : 'border-4 border-orange-400'
      }`}
    >
      <h3
        className={`text-xl md:text-2xl font-heading mb-3 text-center ${
          isReward ? 'text-green-600' : 'text-orange-600'
        }`}
      >
        {title} {isReward ? '🎁' : '📋'}
      </h3>

      <div className="space-y-1.5">
        {sortedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: isReward ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-2 rounded-lg transition-all ${
              item.isRevealed
                ? 'bg-gray-200 line-through opacity-50'
                : isReward
                ? 'bg-green-50'
                : 'bg-orange-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm leading-tight">{item.text}</span>
              {item.isRevealed && <span className="ml-auto text-lg">✓</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs md:text-sm text-gray-600">
        {sortedItems.filter((i) => !i.isRevealed).length} remaining
      </div>
    </div>
  );
};

export default ItemsPanel;
