export type Suit = "zaludy" | "zelene" | "cervene" | "kule";
export type Rank = "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface PrsiState {
  deck: Card[];
  discard: Card[];
  hands: Record<string, Card[]>;
  turn: string;
  currentSuit: Suit;
  pendingDraw: number;
  winner: string | null;
  playerOrder: [string, string];
}

export type PrsiMove =
  | { type: "play"; playerId: string; card: Card; chosenSuit?: Suit }
  | { type: "draw"; playerId: string };
