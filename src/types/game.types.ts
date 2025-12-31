export type Theme = 'boy' | 'girl' | 'adult';

export type GamePhase =
  | 'kid-setup'
  | 'wheel-spin'
  | 'kid-selected'
  | 'theme-selection'
  | 'case-selection'
  | 'opening-cases'
  | 'banker-ready'
  | 'banker-offer'
  | 'swap-offer'
  | 'final-reveal'
  | 'game-result';

export interface GameItem {
  id: string;
  text: string;
  isReward: boolean;
  isRevealed: boolean;
  weight: number; // 1-10 scale, higher = more valuable/harder
}

export interface Suitcase {
  id: number;
  item: GameItem | null;
  isOpened: boolean;
  isPlayerCase: boolean;
}

export interface BankerOffer {
  activity: GameItem;
  round: number;
}

export interface GameResult {
  kidName: string;
  item: GameItem;
  wasSwapped: boolean;
  acceptedBankerOffer: boolean;
}

export interface GameState {
  phase: GamePhase;
  theme: Theme | null;
  suitcases: Suitcase[];
  activities: GameItem[];
  rewards: GameItem[];
  playerCaseId: number | null;
  openedCases: number[];
  bankerOfferCount: number;
  swapOffered: boolean;
  swapAccepted: boolean;
  originalCaseId: number | null;
  result: GameResult | null;
  adultMultiplier?: number; // For adult theme
  numberOfPlayers?: number; // For adult theme
}
