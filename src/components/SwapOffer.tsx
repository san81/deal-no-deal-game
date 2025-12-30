import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

const SwapOffer: React.FC = () => {
  const { state, acceptSwap, declineSwap } = useGame();
  const { playSound } = useSound();

  if (state.phase !== 'swap-offer') {
    return null;
  }

  const playerCase = state.suitcases.find((s) => s.isPlayerCase);
  const otherCase = state.suitcases.find((s) => !s.isOpened && !s.isPlayerCase);

  if (!playerCase || !otherCase) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl w-full"
        >
          {/* Banker Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl text-center mb-6"
          >
            🔄
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-heading text-center mb-4">
            FINAL OFFER!
          </h2>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6">
            <p className="text-2xl md:text-3xl text-center mb-6">
              Only 2 cases left!
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Your Case */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="bg-white text-gray-800 rounded-xl p-6 text-center"
              >
                <div className="text-6xl mb-3">💼</div>
                <div className="font-heading text-3xl mb-2">Case #{playerCase.id}</div>
                <div className="text-yellow-600 font-bold">YOUR CASE</div>
              </motion.div>

              {/* Other Case */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }}
                className="bg-white text-gray-800 rounded-xl p-6 text-center"
              >
                <div className="text-6xl mb-3">💼</div>
                <div className="font-heading text-3xl mb-2">Case #{otherCase.id}</div>
                <div className="text-blue-600 font-bold">OTHER CASE</div>
              </motion.div>
            </div>

            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl md:text-3xl text-center font-heading"
            >
              Would you like to SWAP?
            </motion.p>
          </div>

          <p className="text-center text-lg mb-8">
            This is your last chance to change your mind!
          </p>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => {
                playSound('click');
                declineSwap();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-heading text-2xl py-4 rounded-xl shadow-lg transition-colors"
            >
              Keep Case #{playerCase.id}
            </motion.button>

            <motion.button
              onClick={() => {
                playSound('swap');
                acceptSwap();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white font-heading text-2xl py-4 rounded-xl shadow-lg transition-colors"
            >
              🔄 SWAP to #{otherCase.id}
            </motion.button>
          </div>

          <p className="text-center text-sm mt-4 opacity-75">
            Choose wisely! This decision is final!
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwapOffer;
