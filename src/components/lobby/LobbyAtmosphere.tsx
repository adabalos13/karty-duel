export function LobbyAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.84_0.1_75/0.7),transparent_58%)]" />
      <div className="absolute -top-16 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent/45 blur-3xl" />
      <div className="absolute -bottom-24 -right-8 h-64 w-64 rounded-full bg-primary/18 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
    </div>
  );
}
