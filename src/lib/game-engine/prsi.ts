import { buildDeck, shuffle } from "./deck";
import type { Card, PrsiMove, PrsiState } from "./types";

const HAND_SIZE = 4;

export function createInitialPrsiState(playerIds: [string, string]): PrsiState {
  const deck = shuffle(buildDeck());
  const hands: Record<string, Card[]> = {
    [playerIds[0]]: deck.splice(0, HAND_SIZE),
    [playerIds[1]]: deck.splice(0, HAND_SIZE),
  };
  const firstDiscard = deck.shift()!;

  return {
    deck,
    discard: [firstDiscard],
    hands,
    turn: playerIds[0],
    currentSuit: firstDiscard.suit,
    pendingDraw: 0,
    pendingSkip: false,
    winner: null,
    playerOrder: playerIds,
  };
}

function topCard(state: PrsiState): Card {
  return state.discard[state.discard.length - 1];
}

function otherPlayer(state: PrsiState, playerId: string): string {
  return state.playerOrder.find((id) => id !== playerId)!;
}

export function isCardPlayable(state: PrsiState, card: Card): boolean {
  if (state.pendingDraw > 0) return card.rank === "7";
  if (state.pendingSkip) return card.rank === "A";
  // Svršek je žolík — hraje se na jakoukoli barvu i hodnotu (mimo dluh
  // ze sedmičky a čekání na přebití esa, ošetřené výše).
  if (card.rank === "Q") return true;
  const top = topCard(state);
  return card.suit === state.currentSuit || card.rank === top.rank;
}

export function getPlayableCards(state: PrsiState, playerId: string): Card[] {
  const hand = state.hands[playerId] ?? [];
  return hand.filter((c) => isCardPlayable(state, c));
}

function reshuffleIfNeeded(state: PrsiState, needed: number): PrsiState {
  if (state.deck.length >= needed) return state;
  const top = topCard(state);
  const restOfDiscard = state.discard.slice(0, -1);
  const newDeck = shuffle([...state.deck, ...restOfDiscard]);
  return { ...state, deck: newDeck, discard: [top] };
}

export function applyMove(state: PrsiState, move: PrsiMove): PrsiState {
  if (state.winner) return state;
  if (move.playerId !== state.turn) return state;

  if (move.type === "play") {
    const hand = state.hands[move.playerId] ?? [];
    const idx = hand.findIndex(
      (c) => c.suit === move.card.suit && c.rank === move.card.rank,
    );
    if (idx === -1) return state;
    if (!isCardPlayable(state, move.card)) return state;
    if (move.card.rank === "Q" && !move.chosenSuit) return state;

    const newHand = [...hand.slice(0, idx), ...hand.slice(idx + 1)];
    const newHands = { ...state.hands, [move.playerId]: newHand };
    const newDiscard = [...state.discard, move.card];

    if (newHand.length === 0) {
      return {
        ...state,
        hands: newHands,
        discard: newDiscard,
        winner: move.playerId,
      };
    }

    const newSuit = move.card.rank === "Q" ? move.chosenSuit! : move.card.suit;
    let next: PrsiState = {
      ...state,
      hands: newHands,
      discard: newDiscard,
      currentSuit: newSuit,
      pendingSkip: false,
    };

    if (move.card.rank === "7") {
      next = {
        ...next,
        pendingDraw: next.pendingDraw + 2,
        turn: otherPlayer(state, move.playerId),
      };
    } else if (move.card.rank === "A") {
      // Eso = zastavovací karta. Soupeř ztrácí tah, pokud ho nepřebije
      // vlastním esem (volitelné, viz applyMove "play" o kolo výš).
      next = {
        ...next,
        pendingSkip: true,
        turn: otherPlayer(state, move.playerId),
      };
    } else {
      next = { ...next, turn: otherPlayer(state, move.playerId) };
    }
    return next;
  }

  if (move.type === "draw") {
    // Líznutí (ať povinné kvůli sedmičkám nebo protože hráč nemá/nechce hrát)
    // vždy ukončí tah a předá ho soupeři.
    const amount = state.pendingDraw > 0 ? state.pendingDraw : 1;
    const reshuffled = reshuffleIfNeeded(state, amount);
    const drawn = reshuffled.deck.slice(0, amount);
    const remainingDeck = reshuffled.deck.slice(amount);
    const hand = reshuffled.hands[move.playerId] ?? [];
    const newHands = { ...reshuffled.hands, [move.playerId]: [...hand, ...drawn] };

    return {
      ...reshuffled,
      deck: remainingDeck,
      hands: newHands,
      pendingDraw: 0,
      pendingSkip: false,
      turn: otherPlayer(state, move.playerId),
    };
  }

  if (move.type === "acceptSkip") {
    // Hráč byl zastaven esem a nechce (nebo nemůže) přebít vlastním esem.
    if (!state.pendingSkip) return state;
    return {
      ...state,
      pendingSkip: false,
      turn: otherPlayer(state, move.playerId),
    };
  }

  return state;
}
