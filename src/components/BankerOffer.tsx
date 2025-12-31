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
      // Get all unrevealed items (activities + rewards) on screen
      const unrevealedItems = [
        ...state.activities.filter((a) => !a.isRevealed),
        ...state.rewards.filter((r) => !r.isRevealed),
      ];

      if (unrevealedItems.length > 0) {
        // Calculate average weight of all unrevealed items
        const totalWeight = unrevealedItems.reduce((sum, item) => sum + item.weight, 0);
        const averageWeight = totalWeight / unrevealedItems.length;
        const targetWeight = Math.ceil(averageWeight);

        // For adult theme, calculate and offer the dollar amount directly
        if (state.theme === 'adult' && state.adultMultiplier && state.numberOfPlayers) {
          const maxAmount = state.numberOfPlayers * state.adultMultiplier;
          const activityRange = maxAmount * 0.15; // First 15% for activities (weights 1-5)
          const rewardRange = maxAmount * 0.85; // Remaining 85% for rewards (weights 6-10)

          // Convert rounded-up average weight to dollar amount
          let dollarAmount: number;
          if (targetWeight <= 5) {
            dollarAmount = (targetWeight / 5) * activityRange;
          } else {
            dollarAmount = activityRange + ((targetWeight - 5) / 5) * rewardRange;
          }

          // Format the dollar amount
          const formatCurrency = (amount: number): string => {
            if (amount < 1) {
              return `$${amount.toFixed(2)}`;
            } else if (amount < 1000) {
              return `$${Math.round(amount)}`;
            } else if (amount < 1000000) {
              return `$${(amount / 1000).toFixed(1)}K`.replace('.0K', 'K');
            } else {
              return `$${(amount / 1000000).toFixed(2)}M`.replace('.00M', 'M');
            }
          };

          // Create synthetic offer item for adult theme
          const syntheticOffer: GameItem = {
            id: 'banker-offer',
            text: formatCurrency(dollarAmount),
            isReward: targetWeight > 5, // Treat as reward if weight > 5
            isRevealed: false,
            weight: targetWeight,
          };

          setOffer(syntheticOffer);
        } else {
          // For non-adult themes, find item closest to target weight
          let closestItem = unrevealedItems[0];
          let smallestDifference = Math.abs(closestItem.weight - targetWeight);

          for (const item of unrevealedItems) {
            const difference = Math.abs(item.weight - targetWeight);
            if (difference < smallestDifference) {
              smallestDifference = difference;
              closestItem = item;
            }
          }

          setOffer(closestItem);
        }
      }
    }
  }, [state.phase, state.activities, state.rewards, state.theme, state.adultMultiplier, state.numberOfPlayers]);

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
              {state.theme === 'adult'
                ? '"I\'ll pay you this amount if you quit now!"'
                : offer.isReward
                ? '"Hey kiddo! I\'ll give you this reward if you quit now!"'
                : '"Hey kiddo! I\'ll let you skip this activity if you quit now!"'}
            </p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`bg-white rounded-xl p-4 text-center ${
                state.theme === 'adult' ? 'text-green-600' : offer.isReward ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              <div className="text-3xl mb-2">
                {state.theme === 'adult' ? '💰' : offer.isReward ? '🎁' : '📋'}
              </div>
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
            {state.theme === 'adult'
              ? 'If you accept, the game ends and you get this money!'
              : offer.isReward
              ? 'If you accept, the game ends and you get this reward!'
              : 'If you accept, the game ends and you\'ll do this activity!'}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BankerOffer;
