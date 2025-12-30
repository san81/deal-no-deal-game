import { GameItem } from './game.types';

export interface Kid {
  name: string;
  hasPlayed: boolean;
  result?: {
    item: GameItem;
    isReward: boolean;
  };
}

export interface KidState {
  allKids: Kid[];
  remainingKids: Kid[];
  currentKid: Kid | null;
  playedKids: Kid[];
}
