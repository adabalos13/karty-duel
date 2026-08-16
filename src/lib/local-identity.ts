function playerKey(roomCode: string) {
  return `karty-duel:player:${roomCode}`;
}

export function getPlayerId(roomCode: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(playerKey(roomCode));
}

export function savePlayerId(roomCode: string, playerId: string) {
  localStorage.setItem(playerKey(roomCode), playerId);
}
