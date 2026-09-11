const SUITS = ["zaludy", "zelene", "cervene", "kule"] as const;

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  const Title = compact ? "p" : "h1";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex items-center gap-2" aria-hidden>
        {SUITS.map((suit) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={suit}
            src={`/cards/suit-${suit}.png`}
            alt=""
            className="h-8 w-8 object-contain drop-shadow-sm"
          />
        ))}
      </div>
      <Title className="font-heading text-3xl font-bold tracking-tight text-primary">
        Karty Duel
      </Title>
      {!compact && (
        <p className="mt-1.5 max-w-[20rem] text-sm leading-relaxed text-foreground/75">
          Prší online pro dva. Bez účtu — jen jméno a kód místnosti.
        </p>
      )}
    </div>
  );
}
