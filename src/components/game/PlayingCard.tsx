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
const PIP_COUNT: Partial<Record<Rank, number>> = {
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
};

interface PlayingCardProps {
  card?: Card;
  onClick?: () => void;
  disabled?: boolean;
  faceDown?: boolean;
  className?: string;
}

function PipColumn({ suit, count }: { suit: Suit; count: number }) {
  return (
    <div className="flex flex-col gap-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={`/cards/suit-${suit}.png`}
          alt=""
          className="h-[6px] w-[6px] object-contain sm:h-[8px] sm:w-[8px]"
        />
      ))}
    </div>
  );
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
          "h-20 w-14 shrink-0 rounded-lg border bg-muted sm:h-24 sm:w-16",
          className,
        )}
      />
    );
  }

  const isFaceCard = FACE_RANKS.includes(card.rank);
  const pipCount = PIP_COUNT[card.rank];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || disabled}
      className={cn(
        "relative flex h-20 w-14 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background font-semibold shadow-sm transition-transform sm:h-24 sm:w-16",
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
          <span
            className={cn(
              "absolute top-0.5 left-1 text-[9px] leading-none sm:text-[10px]",
              SUIT_COLOR[card.suit],
            )}
          >
            {RANK_LABEL[card.rank]}
          </span>
          {pipCount ? (
            <div className="flex gap-[3px]">
              <PipColumn suit={card.suit} count={Math.ceil(pipCount / 2)} />
              <PipColumn suit={card.suit} count={Math.floor(pipCount / 2)} />
            </div>
          ) : null}
        </>
      )}
    </button>
  );
}
