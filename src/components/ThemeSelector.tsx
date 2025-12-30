import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types/game.types';
import { useSound } from '../hooks/useSound';

interface ThemeSelectorProps {
  kidName: string;
  onThemeSelect: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ kidName, onThemeSelect }) => {
  const { playSound } = useSound();

  const handleThemeSelect = (theme: Theme) => {
    playSound('click');
    onThemeSelect(theme);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full">
        <motion.h1
          className="text-4xl md:text-6xl font-heading text-white text-center mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          {kidName}'s Turn!
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-heading text-white text-center mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose Your Theme
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Boy Theme */}
          <motion.button
            onClick={() => handleThemeSelect('boy')}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-8xl mb-4">🎮</div>
            <h3 className="text-4xl font-heading mb-4">Boy's Game</h3>
            <div className="text-left space-y-2 text-lg">
              <p>🎯 Nerf guns & toys</p>
              <p>🎮 Video games & Roblox</p>
              <p>⚽ Sports & outdoor fun</p>
              <p>🏀 Dad time & adventures</p>
            </div>
          </motion.button>

          {/* Girl Theme */}
          <motion.button
            onClick={() => handleThemeSelect('girl')}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-400 to-purple-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-8xl mb-4">💎</div>
            <h3 className="text-4xl font-heading mb-4">Girl's Game</h3>
            <div className="text-left space-y-2 text-lg">
              <p>💎 Jewelry & accessories</p>
              <p>🎨 Art supplies & crafts</p>
              <p>📚 Books & shows</p>
              <p>👭 Sleepovers & friends</p>
            </div>
          </motion.button>
        </div>

        <motion.p
          className="text-white text-center mt-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Pick the theme with rewards you'd love! 🌟
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ThemeSelector;
