import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { GameItem } from '../types/game.types';
import { useSound } from '../hooks/useSound';

const BankerOffer: React.FC = () => {
  const { state, acceptBankerOffer, declineBankerOffer } = useGame();
  const { playSound } = useSound();
  const [offer, setOffer] = useState<GameItem | null>(null);

  useEffect(() => {
    if (state.phase === 'banker-offer') {
      // Select a random unrevealed activity
      const unrevealedActivities = state.activities.filter((a) => !a.isRevealed);
      if (unrevealedActivities.length > 0) {
        const randomActivity =
          unrevealedActivities[
            Math.floor(Math.random() * unrevealedActivities.length)
          ];
        setOffer(randomActivity);
      }
    }
  }, [state.phase, state.activities]);

  if (state.phase !== 'banker-offer' || !offer) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-gradient-to-br from-purple-600 to-blue-700 text-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
        >
          {/* Banker Icon */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl text-center mb-6"
          >
            📞
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-heading text-center mb-4">
            Uncle Donald is Calling! 🤵
          </h2>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6">
            <p className="text-xl md:text-2xl text-center mb-4">
              "Hey kiddo! I'll let you skip this activity if you quit now!"
            </p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white text-orange-600 rounded-xl p-4 text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <p className="font-bold text-lg">{offer.text}</p>
            </motion.div>
          </div>

          <p className="text-center text-lg mb-8">
            {state.bankerOfferCount === 1
              ? 'First offer! Think carefully...'
              : 'Final banker offer! Last chance to take the deal!'}
          </p>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => {
                playSound('deal');
                acceptBankerOffer(offer);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white font-heading text-2xl py-4 rounded-xl shadow-lg transition-colors"
            >
              ✅ DEAL!
            </motion.button>

            <motion.button
              onClick={() => {
                playSound('no-deal');
                declineBankerOffer();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 hover:bg-red-600 text-white font-heading text-2xl py-4 rounded-xl shadow-lg transition-colors"
            >
              ❌ NO DEAL!
            </motion.button>
          </div>

          <p className="text-center text-sm mt-4 opacity-75">
            If you accept, the game ends and you'll do this activity!
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BankerOffer;
