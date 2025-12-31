import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types/game.types';
import { useSound } from '../hooks/useSound';
import { useKids } from '../context/KidContext';

interface ThemeSelectorProps {
  kidName: string;
  onThemeSelect: (theme: Theme, adultMultiplier?: number) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ kidName, onThemeSelect }) => {
  const { playSound } = useSound();
  const { kidState } = useKids();
  const [showAdultInput, setShowAdultInput] = useState(false);
  const [multiplier, setMultiplier] = useState('10');

  const totalKids = kidState.allKids.length;

  const handleThemeSelect = (theme: Theme) => {
    playSound('click');
    if (theme === 'adult') {
      setShowAdultInput(true);
    } else {
      onThemeSelect(theme);
    }
  };

  const handleAdultConfirm = () => {
    const multiplierValue = parseInt(multiplier);
    if (multiplierValue > 0) {
      playSound('click');
      onThemeSelect('adult', multiplierValue);
    }
  };

  return (
    <>
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

        <div className="grid md:grid-cols-3 gap-8">
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
            initial={{ x: 0, opacity: 0 }}
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

          {/* Adult Theme */}
          <motion.button
            onClick={() => handleThemeSelect('adult')}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-8xl mb-4">💰</div>
            <h3 className="text-4xl font-heading mb-4">Adult Game</h3>
            <div className="text-left space-y-2 text-lg">
              <p>💵 Real money amounts</p>
              <p>💸 $0.01 to $1,000,000</p>
              <p>🎰 High stakes decisions</p>
              <p>🏆 Classic Deal or No Deal</p>
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

      {/* Adult Multiplier Input Modal */}
      <AnimatePresence>
        {showAdultInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-3xl font-heading text-center mb-4 text-gray-800">
                💰 Adult Game Setup
              </h2>

              <p className="text-center text-gray-600 mb-6">
                With {totalKids} player{totalKids !== 1 ? 's' : ''}, set the dollar multiplier:
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Multiplier ($ per player):
                </label>
                <input
                  type="number"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="e.g., 5 or 10"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Max range: ${totalKids} × ${multiplier} = ${totalKids * parseInt(multiplier || '0')}
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={handleAdultConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white text-xl font-heading rounded-xl shadow-lg"
                >
                  ✓ Start Adult Game
                </motion.button>

                <motion.button
                  onClick={() => {
                    playSound('click');
                    setShowAdultInput(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gray-300 text-gray-700 text-lg font-semibold rounded-xl"
                >
                  ← Back to Themes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeSelector;
