import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Suitcase from './Suitcase';
import ItemsPanel from './ItemsPanel';
import { useSound } from '../hooks/useSound';

const GameBoard: React.FC = () => {
  const { state, selectPlayerCase, openCase, openFinalCase, setPhase } = useGame();
  const { playSound } = useSound();
  const { phase, suitcases, activities, rewards, playerCaseId } = state;

  const handleCaseClick = (caseId: number) => {
    if (phase === 'case-selection') {
      playSound('click');
      selectPlayerCase(caseId);
    } else if (phase === 'opening-cases') {
      // Can only open cases that aren't the player's case and aren't already opened
      const suitcase = suitcases.find((s) => s.id === caseId);
      if (suitcase && !suitcase.isPlayerCase && !suitcase.isOpened) {
        playSound('case-open');
        openCase(caseId);

        // Play reward or activity sound after opening
        setTimeout(() => {
          if (suitcase.item?.isReward) {
            playSound('reward');
          } else {
            playSound('activity');
          }
        }, 300);
      }
    }
  };

  const handleCheckBankerOffer = () => {
    playSound('banker');
    setPhase('banker-offer');
  };

  const handleContinuePlaying = () => {
    playSound('click');

    // After 2nd banker offer (5 cases opened), trigger swap instead of continuing
    if (state.openedCases.length === 5 && state.bankerOfferCount === 2) {
      setPhase('swap-offer');
    } else {
      setPhase('opening-cases');
    }
  };

  const handleSeeResult = () => {
    playSound('drumroll');
    setTimeout(() => {
      openFinalCase();
    }, 1000);
  };

  const getInstructions = () => {
    switch (phase) {
      case 'case-selection':
        return '👆 Pick your lucky case!';
      case 'opening-cases':
        const remaining = suitcases.filter(
          (s) => !s.isOpened && !s.isPlayerCase
        ).length;
        return `🎯 Open a case! (${remaining} remaining)`;
      case 'banker-ready':
        return '📞 Uncle Donald wants to make you an offer!';
      case 'final-reveal':
        return '🎁 Time to open your case!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Instructions */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-5xl font-heading text-white mb-2">
          {getInstructions()}
        </h2>
        <p className="text-white text-lg">
          {phase === 'case-selection'
            ? 'This will be your case for the entire game!'
            : phase === 'banker-ready'
            ? 'Choose to hear his offer or keep playing!'
            : phase === 'final-reveal'
            ? 'Your case is still closed. Click the button below to open it and see what you got!'
            : 'Reveal what\'s inside and cross it off the board'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8 max-w-7xl mx-auto">
        {/* Left Panel - Activities */}
        <div className="hidden lg:block">
          <ItemsPanel title="Activities" items={activities} isReward={false} />
        </div>

        {/* Center - Suitcases */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {suitcases.map((suitcase) => (
              <Suitcase
                key={suitcase.id}
                suitcase={suitcase}
                onSelect={() => handleCaseClick(suitcase.id)}
                disabled={
                  (phase === 'opening-cases' && suitcase.isPlayerCase) ||
                  phase === 'final-reveal' ||
                  phase === 'banker-ready'
                }
                showContent={suitcase.isOpened}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Rewards */}
        <div className="hidden lg:block">
          <ItemsPanel title="Rewards" items={rewards} isReward={true} />
        </div>
      </div>

      {/* Mobile Panels */}
      <div className="lg:hidden grid md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
        <ItemsPanel title="Activities" items={activities} isReward={false} />
        <ItemsPanel title="Rewards" items={rewards} isReward={true} />
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center"
      >
        <div className="inline-block bg-white/20 backdrop-blur rounded-full px-6 py-3">
          <span className="text-white font-semibold">
            Cases Opened: {state.openedCases.length} / 6
            {playerCaseId && ` | Your Case: #${playerCaseId}`}
          </span>
        </div>
      </motion.div>

      {/* Banker Ready Buttons */}
      {phase === 'banker-ready' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl"
          >
            📞
          </motion.div>

          <p className="text-white text-2xl md:text-3xl font-heading text-center">
            Uncle Donald is calling! 🤵
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              onClick={handleCheckBankerOffer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-heading text-xl rounded-xl shadow-lg hover:shadow-2xl"
            >
              📞 Check Uncle Donald's Offer
            </motion.button>

            <motion.button
              onClick={handleContinuePlaying}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-heading text-xl rounded-xl shadow-lg hover:shadow-2xl"
            >
              ⏭️ Keep Playing
            </motion.button>
          </div>

          <p className="text-white/80 text-sm">
            {state.bankerOfferCount === 1
              ? "First offer! You can check it or keep playing."
              : "Final offer! This is your last chance to hear Uncle Donald."}
          </p>
        </motion.div>
      )}

      {/* Final Reveal - See Result Button */}
      {phase === 'final-reveal' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-8xl"
          >
            🎁
          </motion.div>

          <p className="text-white text-2xl md:text-3xl font-heading text-center">
            Your final case is Case #{playerCaseId}!
          </p>

          <motion.button
            onClick={handleSeeResult}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-heading text-2xl rounded-xl shadow-2xl hover:shadow-3xl"
          >
            💼 Open My Case!
          </motion.button>

          <p className="text-white/80 text-sm">
            Click to reveal what's inside!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
