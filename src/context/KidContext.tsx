import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Kid, KidState } from '../types/kid.types';
import {
  saveKidsToStorage,
  loadKidsFromStorage,
  clearKidsFromStorage,
} from '../utils/storage';

interface KidContextType {
  kidState: KidState;
  addKid: (name: string) => boolean;
  removeKid: (name: string) => void;
  selectKid: (name: string) => void;
  markKidAsPlayed: (item: any) => void;
  resetKids: () => void;
  resetAllKids: () => void;
  hasRemainingKids: () => boolean;
}

const initialKidState: KidState = {
  allKids: [],
  remainingKids: [],
  currentKid: null,
  playedKids: [],
};

const KidContext = createContext<KidContextType | undefined>(undefined);

export const KidProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kidState, setKidState] = useState<KidState>(initialKidState);

  // Load kids from localStorage on mount
  useEffect(() => {
    const savedKids = loadKidsFromStorage();
    if (savedKids && savedKids.length > 0) {
      const remaining = savedKids.filter((k) => !k.hasPlayed);
      const played = savedKids.filter((k) => k.hasPlayed);

      setKidState({
        allKids: savedKids,
        remainingKids: remaining,
        currentKid: null,
        playedKids: played,
      });
    }
  }, []);

  // Save to localStorage whenever kidState changes
  useEffect(() => {
    if (kidState.allKids.length > 0) {
      saveKidsToStorage(kidState.allKids);
    }
  }, [kidState]);

  const addKid = (name: string): boolean => {
    const trimmedName = name.trim();

    // Validation
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 15) {
      return false;
    }

    // Check for duplicates
    const isDuplicate = kidState.allKids.some(
      (kid) => kid.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      return false;
    }

    // Check max limit
    if (kidState.allKids.length >= 12) {
      return false;
    }

    const newKid: Kid = {
      name: trimmedName,
      hasPlayed: false,
    };

    setKidState((prev) => ({
      ...prev,
      allKids: [...prev.allKids, newKid],
      remainingKids: [...prev.remainingKids, newKid],
    }));

    return true;
  };

  const removeKid = (name: string) => {
    setKidState((prev) => {
      const updatedAllKids = prev.allKids.filter((kid) => kid.name !== name);
      const updatedRemainingKids = prev.remainingKids.filter(
        (kid) => kid.name !== name
      );

      // Clear storage if no kids left
      if (updatedAllKids.length === 0) {
        clearKidsFromStorage();
      }

      return {
        ...prev,
        allKids: updatedAllKids,
        remainingKids: updatedRemainingKids,
      };
    });
  };

  const selectKid = (name: string) => {
    const kid = kidState.remainingKids.find((k) => k.name === name);
    if (kid) {
      setKidState((prev) => ({
        ...prev,
        currentKid: kid,
      }));
    }
  };

  const markKidAsPlayed = (item: any) => {
    if (!kidState.currentKid) return;

    const updatedKid: Kid = {
      ...kidState.currentKid,
      hasPlayed: true,
      result: {
        item,
        isReward: item.isReward,
      },
    };

    setKidState((prev) => ({
      ...prev,
      allKids: prev.allKids.map((kid) =>
        kid.name === updatedKid.name ? updatedKid : kid
      ),
      remainingKids: prev.remainingKids.filter(
        (kid) => kid.name !== updatedKid.name
      ),
      playedKids: [...prev.playedKids, updatedKid],
      currentKid: null,
    }));
  };

  const resetKids = () => {
    setKidState(initialKidState);
    clearKidsFromStorage();
  };

  const resetAllKids = () => {
    // Reset all kids' played status but keep the names
    const resetKids = kidState.allKids.map((kid) => ({
      ...kid,
      hasPlayed: false,
      result: undefined,
    }));

    setKidState({
      allKids: resetKids,
      remainingKids: resetKids,
      currentKid: null,
      playedKids: [],
    });
  };

  const hasRemainingKids = (): boolean => {
    return kidState.remainingKids.length > 0;
  };

  return (
    <KidContext.Provider
      value={{
        kidState,
        addKid,
        removeKid,
        selectKid,
        markKidAsPlayed,
        resetKids,
        resetAllKids,
        hasRemainingKids,
      }}
    >
      {children}
    </KidContext.Provider>
  );
};

export const useKids = () => {
  const context = useContext(KidContext);
  if (!context) {
    throw new Error('useKids must be used within a KidProvider');
  }
  return context;
};
