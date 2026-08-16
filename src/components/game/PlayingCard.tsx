import { cn } from "@/lib/utils";
import type { Card, Rank, Suit } from "@/lib/game-engine/types";

const SUIT_SYMBOL: Record<Suit, string> = {
  zaludy: "🌰",
  zelene: "🍃",
  cervene: "♥",
  kule: "🔔",
};

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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || disabled}
      className={cn(
        "flex h-16 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border bg-background font-semibold shadow-sm transition-transform sm:h-20 sm:w-14",
        onClick && !disabled && "cursor-pointer hover:-translate-y-1",
        disabled && "opacity-40",
        SUIT_COLOR[card.suit],
        className,
      )}
    >
      <span className="text-xs sm:text-sm">{RANK_LABEL[card.rank]}</span>
      <span className="text-base leading-none sm:text-lg">{SUIT_SYMBOL[card.suit]}</span>
    </button>
  );
}
