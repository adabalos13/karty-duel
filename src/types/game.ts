export type GameType = "prsi" | "uno";
export type RoomStatus = "waiting" | "playing" | "finished";

export interface Room {
  id: string;
  code: string;
  game_type: GameType;
  status: RoomStatus;
  created_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  joined_at: string;
}
