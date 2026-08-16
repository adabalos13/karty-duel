"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { getPlayerId, savePlayerId } from "@/lib/local-identity";
import { createInitialPrsiState } from "@/lib/game-engine/prsi";
import { PrsiGame } from "@/components/game/PrsiGame";
import type { Player, Room } from "@/types/game";

const GAME_LABEL: Record<Room["game_type"], string> = {
  prsi: "Prší",
  uno: "Uno",
};

export default function RoomPage() {
  const params = useParams<{ roomCode: string }>();
  const roomCode = params.roomCode.toLowerCase();

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true });
    if (data) setPlayers(data);
  }, []);

  const loadGame = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("games")
      .select("id")
      .eq("room_id", roomId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setGameId(data.id);
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      const { data: roomData } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .maybeSingle();

      if (!active) return;
      if (!roomData) {
        setNotFound(true);
        return;
      }
      setRoom(roomData);
      setMyPlayerId(getPlayerId(roomCode));
      await loadPlayers(roomData.id);
      if (roomData.status === "playing") {
        await loadGame(roomData.id);
      }

      const channel = supabase
        .channel(`room:${roomData.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomData.id}` },
          () => loadPlayers(roomData.id),
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomData.id}` },
          (payload) => {
            const updated = payload.new as Room;
            setRoom(updated);
            if (updated.status === "playing") {
              loadGame(updated.id);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanupPromise = init();
    return () => {
      active = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [roomCode, loadPlayers, loadGame]);

  async function handleJoin() {
    if (!room) return;
    if (!joinName.trim()) {
      setError("Zadej jméno.");
      return;
    }
    setJoining(true);
    setError(null);
    try {
      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({ room_id: room.id, name: joinName.trim() })
        .select("id")
        .single();
      if (playerError) throw playerError;

      savePlayerId(roomCode, player.id);
      setMyPlayerId(player.id);
      await loadPlayers(room.id);
    } catch (err) {
      console.error(err);
      setError("Něco se nepovedlo. Zkus to prosím znovu.");
    } finally {
      setJoining(false);
    }
  }

  async function handleStart() {
    if (!room || players.length < 2) return;
    if (room.game_type === "prsi") {
      const ids = players.map((p) => p.id) as [string, string];
      const initialState = createInitialPrsiState(ids);
      const { data: game } = await supabase
        .from("games")
        .insert({ room_id: room.id, state: initialState })
        .select("id")
        .single();
      if (game) setGameId(game.id);
    }
    await supabase.from("rooms").update({ status: "playing" }).eq("id", room.id);
  }

  async function handlePlayAgain() {
    if (!room || !gameId || players.length < 2) return;
    const ids = players.map((p) => p.id) as [string, string];
    const initialState = createInitialPrsiState(ids);
    await supabase
      .from("games")
      .update({ state: initialState, updated_at: new Date().toISOString() })
      .eq("id", gameId);
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/hra/${roomCode}` : "";

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
  }

  if (notFound) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6 text-center">
            <p>Místnost {roomCode} neexistuje.</p>
            <Link href="/" className={buttonVariants({ className: "mt-4" })}>
              Zpět na úvod
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">Načítám…</p>
      </main>
    );
  }

  const isHost = players[0]?.id === myPlayerId;
  const iAmIn = players.some((p) => p.id === myPlayerId);
  const gameInProgress = room.status === "playing" && room.game_type === "prsi";
  const playerNames = Object.fromEntries(players.map((p) => [p.id, p.name]));

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className={gameInProgress ? "w-full max-w-md" : "w-full max-w-sm"}>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-2xl">{roomCode}</CardTitle>
            <Badge variant="secondary">{GAME_LABEL[room.game_type]}</Badge>
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            ← Opustit hru
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!iAmIn && room.status === "waiting" && (
            <div className="flex flex-col gap-3 rounded-md border p-3">
              <Label htmlFor="join-name">Tvoje jméno</Label>
              <Input
                id="join-name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Jméno"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleJoin} disabled={joining}>
                {joining ? "Připojuji…" : "Připojit se do místnosti"}
              </Button>
            </div>
          )}

          {!gameInProgress && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Hráči ({players.length}/2)
              </p>
              <ul className="flex flex-col gap-2">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span>{p.name}</span>
                    {p.id === myPlayerId && (
                      <Badge variant="outline">ty</Badge>
                    )}
                  </li>
                ))}
                {players.length === 0 && (
                  <li className="text-sm text-muted-foreground">Zatím nikdo.</li>
                )}
              </ul>
            </div>
          )}

          {room.status === "waiting" && iAmIn && (
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={copyLink}>
                Zkopírovat odkaz na místnost
              </Button>
              {isHost && (
                <Button onClick={handleStart} disabled={players.length < 2}>
                  {players.length < 2 ? "Čekám na druhého hráče…" : "Začít hru"}
                </Button>
              )}
              {!isHost && (
                <p className="text-center text-sm text-muted-foreground">
                  Čekám, až hru spustí host…
                </p>
              )}
            </div>
          )}

          {room.status === "playing" && room.game_type === "uno" && (
            <p className="text-center text-sm text-muted-foreground">
              Hra běží — samotné Uno UI přijde ve Fázi 3.
            </p>
          )}

          {gameInProgress && myPlayerId && gameId && (
            <PrsiGame
              gameId={gameId}
              myPlayerId={myPlayerId}
              playerNames={playerNames}
              onPlayAgain={handlePlayAgain}
            />
          )}

          {gameInProgress && (!myPlayerId || !gameId) && (
            <p className="text-center text-sm text-muted-foreground">Načítám hru…</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
