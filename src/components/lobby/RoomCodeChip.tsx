import { cn } from "@/lib/utils";

interface RoomCodeChipProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "px-2 py-0.5 text-sm",
  md: "px-2.5 py-1 text-lg",
  lg: "px-3 py-1.5 text-2xl",
} as const;

export function RoomCodeChip({
  code,
  size = "md",
  className,
}: RoomCodeChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-primary/25 bg-secondary font-mono font-semibold tracking-[0.22em] text-foreground lowercase shadow-sm",
        SIZE_CLASS[size],
        className,
      )}
    >
      {code}
    </span>
  );
}
