import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKids } from '../context/KidContext';
import { useSound } from '../hooks/useSound';

interface KidNameSetupProps {
  onReady: () => void;
}

const KidNameSetup: React.FC<KidNameSetupProps> = ({ onReady }) => {
  const { kidState, addKid, removeKid } = useKids();
  const { playSound } = useSound();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddKid = () => {
    const success = addKid(inputValue);

    if (!success) {
      if (inputValue.trim().length < 2 || inputValue.trim().length > 15) {
        setError('Name must be 2-15 characters');
      } else if (
        kidState.allKids.some(
          (kid) => kid.name.toLowerCase() === inputValue.trim().toLowerCase()
        )
      ) {
        setError('Name already exists');
      } else if (kidState.allKids.length >= 12) {
        setError('Maximum 12 kids allowed');
      } else {
        setError('Invalid name');
      }
      return;
    }

    playSound('click');
    setInputValue('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddKid();
    }
  };

  const handleRemove = (name: string) => {
    playSound('click');
    removeKid(name);
    setError('');
  };

  const canProceed = kidState.allKids.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        <motion.h1
          className="text-5xl md:text-6xl font-heading text-center mb-2 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          🎪 Who's Playing Today? 🎪
        </motion.h1>

        <p className="text-center text-gray-600 mb-8">
          Add all the kids who want to play!
        </p>

        {/* Input Section */}
        <div className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter kid's name..."
              className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none transition-colors"
              maxLength={15}
            />
            <motion.button
              onClick={handleAddKid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary-green text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              + Add
            </motion.button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 ml-2"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Kids List */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Current Players ({kidState.allKids.length}/12):
          </h3>

          {kidState.allKids.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No players added yet. Add at least one player to continue!
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {kidState.allKids.map((kid, index) => (
                <motion.div
                  key={kid.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 px-4 py-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="font-medium text-lg">{kid.name}</span>
                  </div>
                  <motion.button
                    onClick={() => handleRemove(kid.name)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-500 hover:text-red-700 font-bold text-xl px-3 py-1"
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Ready Button */}
        <motion.button
          onClick={onReady}
          disabled={!canProceed}
          whileHover={canProceed ? { scale: 1.05 } : {}}
          whileTap={canProceed ? { scale: 0.95 } : {}}
          className={`w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white hover:shadow-2xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canProceed ? 'Ready to Spin! 🎡 →' : 'Add at least 1 player'}
        </motion.button>

        {kidState.allKids.length === 1 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            💡 Playing alone? No problem! Just click "Ready to Spin!"
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default KidNameSetup;
