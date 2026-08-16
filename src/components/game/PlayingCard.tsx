import { cn } from "@/lib/utils";
import type { Card, Rank, Suit } from "@/lib/game-engine/types";

const SUIT_COLOR: Record<Suit, string> = {
  zaludy: "text-amber-800 dark:text-amber-500",
  zelene: "text-green-700 dark:text-green-400",
  cervene: "text-red-600 dark:text-red-400",
  kule: "text-rose-600 dark:text-rose-400",
};

const RANK_LABEL: Record<Rank, string> = {
  "7": "VII",
  "8": "VIII",
  "9": "IX",
  "10": "X",
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
    <div className="flex flex-col gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={`/cards/suit-${suit}.png`}
          alt=""
          className="h-[10px] w-[10px] object-contain sm:h-[13px] sm:w-[13px]"
        />
      ))}
    </div>
  );
}

function PipLayout({ suit, count }: { suit: Suit; count: number }) {
  // Liché počty (7, 9) se skládají jako na klasickém balíčku: N-1-N
  // se středovým pipsem, sudé (8, 10) jako dva rovnoměrné sloupce.
  if (count % 2 === 1) {
    const side = (count - 1) / 2;
    return (
      <div className="flex items-center gap-1">
        <PipColumn suit={suit} count={side} />
        <PipColumn suit={suit} count={1} />
        <PipColumn suit={suit} count={side} />
      </div>
    );
  }
  const side = count / 2;
  return (
    <div className="flex gap-1">
      <PipColumn suit={suit} count={side} />
      <PipColumn suit={suit} count={side} />
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
          "h-28 w-20 shrink-0 rounded-lg border bg-muted sm:h-32 sm:w-24",
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
        "relative flex h-28 w-20 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border bg-background font-semibold shadow-sm transition-transform sm:h-32 sm:w-24",
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
              "absolute top-1 left-1.5 text-xs leading-none font-bold sm:text-sm",
              SUIT_COLOR[card.suit],
            )}
          >
            {RANK_LABEL[card.rank]}
          </span>
          {pipCount ? <PipLayout suit={card.suit} count={pipCount} /> : null}
        </>
      )}
    </button>
  );
}
