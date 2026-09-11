export function LobbyAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-28 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -bottom-10 -left-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
    </div>
  );
}
