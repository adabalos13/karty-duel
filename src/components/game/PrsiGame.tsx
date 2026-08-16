"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import {
  applyMove,
  getPlayableCards,
  isCardPlayable,
} from "@/lib/game-engine/prsi";
import type { Card, PrsiState, Suit } from "@/lib/game-engine/types";
import { PlayingCard } from "./PlayingCard";

const SUIT_LABEL: Record<Suit, string> = {
  zaludy: "Žaludy",
  zelene: "Zelené",
  cervene: "Červené",
  kule: "Kule",
};
const SUITS: Suit[] = ["zaludy", "zelene", "cervene", "kule"];

interface PrsiGameProps {
  gameId: string;
  myPlayerId: string;
  playerNames: Record<string, string>;
  onPlayAgain: () => void;
}

export function PrsiGame({
  gameId,
  myPlayerId,
  playerNames,
  onPlayAgain,
}: PrsiGameProps) {
  const [state, setState] = useState<PrsiState | null>(null);
  const [pendingSuitCard, setPendingSuitCard] = useState<Card | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("games")
        .select("state")
        .eq("id", gameId)
        .single();
      if (active && data) setState(data.state as PrsiState);
    }
    load();

    const channel = supabase
      .channel(`game:${gameId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => setState(payload.new.state as PrsiState),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const persist = useCallback(
    async (next: PrsiState) => {
      setState(next);
      await supabase
        .from("games")
        .update({ state: next, updated_at: new Date().toISOString() })
        .eq("id", gameId);
    },
    [gameId],
  );

  if (!state) {
    return <p className="text-center text-sm text-muted-foreground">Načítám hru…</p>;
  }

  const myTurn = state.turn === myPlayerId && !state.winner;
  const opponentId = state.playerOrder.find((id) => id !== myPlayerId)!;
  const myHand = state.hands[myPlayerId] ?? [];
  const opponentHand = state.hands[opponentId] ?? [];
  const top = state.discard[state.discard.length - 1];

  function handleCardClick(card: Card) {
    if (!myTurn) return;
    if (card.rank === "Q") {
      setPendingSuitCard(card);
      return;
    }
    persist(applyMove(state!, { type: "play", playerId: myPlayerId, card }));
  }

  function chooseSuit(suit: Suit) {
    if (!pendingSuitCard) return;
    persist(
      applyMove(state!, {
        type: "play",
        playerId: myPlayerId,
        card: pendingSuitCard,
        chosenSuit: suit,
      }),
    );
    setPendingSuitCard(null);
  }

  function handleDraw() {
    if (!myTurn) return;
    persist(applyMove(state!, { type: "draw", playerId: myPlayerId }));
  }

  if (state.winner) {
    const iWon = state.winner === myPlayerId;
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <p className="text-xl font-semibold">
          {iWon ? "Vyhrál(a) jsi! 🎉" : `Vyhrál(a) ${playerNames[state.winner]}.`}
        </p>
        <Button onClick={onPlayAgain}>Hrát znovu</Button>
      </div>
    );
  }

  const canPlaySomething = getPlayableCards(state, myPlayerId).length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{playerNames[opponentId]}</span>
        <span className="text-xs text-muted-foreground">{opponentHand.length} karet</span>
      </div>
      <div className="flex justify-center gap-1">
        {opponentHand.map((_, i) => (
          <PlayingCard key={i} faceDown />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 py-2">
        <PlayingCard card={top} />
        <p className="text-xs text-muted-foreground">
          Barva: {SUIT_LABEL[state.currentSuit]}
          {state.pendingDraw > 0 && ` · Líznutí: ${state.pendingDraw}`}
        </p>
        <p className="text-sm font-medium">
          {myTurn ? "Jsi na tahu" : `Na tahu: ${playerNames[state.turn]}`}
        </p>
      </div>

      {myTurn && !canPlaySomething && (
        <div className="flex justify-center">
          <Button onClick={handleDraw}>
            Lízni {state.pendingDraw > 0 ? state.pendingDraw : "1"} kartu/y
          </Button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-1">
        {myHand.map((card, i) => (
          <PlayingCard
            key={`${card.suit}-${card.rank}-${i}`}
            card={card}
            disabled={!myTurn || !isCardPlayable(state, card)}
            onClick={
              myTurn && isCardPlayable(state, card)
                ? () => handleCardClick(card)
                : undefined
            }
          />
        ))}
      </div>

      <Dialog
        open={!!pendingSuitCard}
        onOpenChange={(open) => !open && setPendingSuitCard(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vyber barvu</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {SUITS.map((suit) => (
              <Button key={suit} variant="outline" onClick={() => chooseSuit(suit)}>
                {SUIT_LABEL[suit]}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
