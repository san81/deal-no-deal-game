import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useKids } from '../context/KidContext';
import confetti from 'canvas-confetti';
import { useSound } from '../hooks/useSound';

interface GameResultProps {
  onNextKid: () => void;
  onNewGame: () => void;
  onChangeTheme: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  onNextKid,
  onNewGame,
  onChangeTheme,
}) => {
  const { state } = useGame();
  const { kidState, hasRemainingKids, markKidAsPlayed } = useKids();
  const { playSound } = useSound();

  const playerCase = state.suitcases.find((s) => s.isPlayerCase);
  // If banker offer was accepted, use the offered activity, otherwise use player's case
  const item = state.result?.acceptedBankerOffer
    ? state.result?.item
    : (playerCase?.item || state.result?.item);

  useEffect(() => {
    if (item) {
      // Play drumroll first
      playSound('drumroll');

      // Mark kid as played with their result
      if (kidState.currentKid) {
        markKidAsPlayed(item);
      }

      // Celebration if reward
      if (item.isReward) {
        // Play fanfare after drumroll
        setTimeout(() => {
          playSound('fanfare');
        }, 1000);

        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#3B82F6', '#EC4899', '#FBBF24', '#10B981'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8B5CF6', '#F97316', '#14B8A6'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    }
  }, [item]);

  if (!item) return null;

  const isReward = item.isReward;
  const remainingKids = kidState.remainingKids.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-3xl w-full">
        {/* Result Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center ${
            isReward ? 'border-8 border-green-400' : 'border-8 border-orange-400'
          }`}
        >
          <motion.div
            animate={isReward ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ repeat: isReward ? Infinity : 0, duration: 1 }}
            className="text-9xl mb-6"
          >
            {isReward ? '🎉' : '📋'}
          </motion.div>

          <h2
            className={`text-4xl md:text-6xl font-heading mb-4 ${
              isReward ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {state.result?.acceptedBankerOffer ? (
              <>
                {kidState.currentKid?.name || 'You'} Accepted the Deal:
              </>
            ) : (
              <>
                {kidState.currentKid?.name || 'You'}{' '}
                {isReward ? 'Won' : 'Got'}:
              </>
            )}
          </h2>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl md:text-4xl font-bold mb-8 p-6 rounded-2xl ${
              isReward
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {item.text}
          </motion.div>

          {/* Swap Info */}
          {state.swapOffered && (
            <div className="mb-6 text-lg text-gray-600">
              {state.swapAccepted ? (
                <p>
                  ✅ You swapped from Case #{state.originalCaseId} to Case #
                  {state.playerCaseId}
                </p>
              ) : (
                <p>
                  ✋ You kept your original Case #{state.playerCaseId}
                </p>
              )}
            </div>
          )}

          {/* Banker Offer Info */}
          {state.result?.acceptedBankerOffer && (
            <div className="mb-6 text-lg text-gray-600">
              <p>💼 You accepted the banker's offer!</p>
            </div>
          )}

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl mb-8"
          >
            {state.result?.acceptedBankerOffer
              ? '💼 You took the banker\'s deal! Time to complete this activity.'
              : isReward
              ? '🌟 Awesome! Enjoy your reward! 🌟'
              : '💪 Time to complete this activity! 💪'}
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {remainingKids > 0 ? (
            <>
              <motion.button
                onClick={onNextKid}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white text-2xl font-heading rounded-xl shadow-lg"
              >
                🎡 Spin for Next Kid ({remainingKids} remaining)
              </motion.button>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  onClick={onNewGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl"
                >
                  🔄 New Game (Same Theme)
                </motion.button>

                <motion.button
                  onClick={onChangeTheme}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-xl"
                >
                  🎨 Change Theme
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center"
              >
                <h3 className="text-3xl font-heading text-white mb-4">
                  🎊 Everyone Has Played! 🎊
                </h3>
                <p className="text-white text-lg">
                  All {kidState.playedKids.length} kids have completed their turns!
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  onClick={onNextKid}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white text-xl font-heading rounded-xl"
                >
                  🎡 Play Another Round
                </motion.button>

                <motion.button
                  onClick={onChangeTheme}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold rounded-xl"
                >
                  🔄 Start Fresh
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameResult;
