import { cn } from "@/lib/utils";
import type { Card, Rank, Suit } from "@/lib/game-engine/types";

const SUIT_COLOR: Record<Suit, string> = {
  zaludy: "text-amber-800 dark:text-amber-500",
  zelene: "text-green-700 dark:text-green-400",
  cervene: "text-red-600 dark:text-red-400",
  kule: "text-rose-600 dark:text-rose-400",
};

const RANK_LABEL: Record<Rank, string> = {
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  J: "Sp", // Spodek
  Q: "Sv", // Svršek
  K: "Kr", // Král
  A: "Es", // Eso
};

const FACE_RANKS: Rank[] = ["J", "Q", "K", "A"];

interface PlayingCardProps {
  card?: Card;
  onClick?: () => void;
  disabled?: boolean;
  faceDown?: boolean;
  className?: string;
}

export function PlayingCard({
  card,
  onClick,
  disabled,
  faceDown,
  className,
}: PlayingCardProps) {
  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "h-16 w-11 shrink-0 rounded-md border bg-muted sm:h-20 sm:w-14",
          className,
        )}
      />
    );
  }

  const isFaceCard = FACE_RANKS.includes(card.rank);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || disabled}
      className={cn(
        "relative flex h-16 w-11 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border bg-background font-semibold shadow-sm transition-transform sm:h-20 sm:w-14",
        onClick && !disabled && "cursor-pointer hover:-translate-y-1",
        disabled && "opacity-40",
        className,
      )}
    >
      {isFaceCard ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/cards/face-${card.suit}-${card.rank}.png`}
          alt={`${RANK_LABEL[card.rank]} ${card.suit}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <span className={cn("text-xs sm:text-sm", SUIT_COLOR[card.suit])}>
            {RANK_LABEL[card.rank]}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/cards/suit-${card.suit}.png`}
            alt={card.suit}
            className="h-6 w-6 object-contain sm:h-8 sm:w-8"
          />
        </>
      )}
    </button>
  );
}
