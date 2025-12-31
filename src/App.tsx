import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { KidProvider, useKids } from './context/KidContext';
import KidNameSetup from './components/KidNameSetup';
import SpinningWheel from './components/SpinningWheel';
import ThemeSelector from './components/ThemeSelector';
import GameBoard from './components/GameBoard';
import BankerOffer from './components/BankerOffer';
import SwapOffer from './components/SwapOffer';
import GameResult from './components/GameResult';
import { GamePhase, Theme } from './types/game.types';

function GameFlow() {
  const { state, setPhase, selectTheme, startNewGame, resetGame } = useGame();
  const { kidState, selectKid, resetAllKids } = useKids();

  const handleWheelReady = () => {
    // Reset all kids to make them available for spinning
    // This ensures the wheel shows all kids from the setup screen
    resetAllKids();
    setPhase('wheel-spin');
  };

  const handleKidSelected = (kidName: string) => {
    selectKid(kidName);
    setPhase('theme-selection');
  };

  const handleThemeSelect = (theme: Theme, adultMultiplier?: number) => {
    const numberOfPlayers = kidState.allKids.length;
    selectTheme(theme, adultMultiplier, numberOfPlayers);
  };

  const handleNextKid = () => {
    if (kidState.remainingKids.length > 0) {
      setPhase('wheel-spin');
    } else {
      // All kids have played - reset and start over
      resetAllKids();
      setPhase('wheel-spin');
    }
  };

  const handleNewGame = () => {
    startNewGame();
    setPhase('case-selection');
  };

  const handleChangeTheme = () => {
    resetGame();
    setPhase('kid-setup');
  };

  // Removed automatic transition - user now clicks button to see result

  // Render appropriate component based on game phase
  const renderPhase = () => {
    switch (state.phase) {
      case 'kid-setup':
        return <KidNameSetup onReady={handleWheelReady} />;

      case 'wheel-spin':
        return <SpinningWheel onKidSelected={handleKidSelected} />;

      case 'theme-selection':
        return (
          <ThemeSelector
            kidName={kidState.currentKid?.name || 'Player'}
            onThemeSelect={handleThemeSelect}
          />
        );

      case 'case-selection':
      case 'opening-cases':
      case 'banker-ready':
      case 'final-reveal':
        return <GameBoard />;

      case 'game-result':
        return (
          <GameResult
            onNextKid={handleNextKid}
            onNewGame={handleNewGame}
            onChangeTheme={handleChangeTheme}
          />
        );

      default:
        return <KidNameSetup onReady={handleWheelReady} />;
    }
  };

  return (
    <>
      {renderPhase()}
      <BankerOffer />
      <SwapOffer />
    </>
  );
}

function App() {
  return (
    <KidProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
          <GameFlow />
        </div>
      </GameProvider>
    </KidProvider>
  );
}

export default App;
