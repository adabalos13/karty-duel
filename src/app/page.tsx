"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/lobby/BrandMark";
import { LobbyAtmosphere } from "@/components/lobby/LobbyAtmosphere";
import { supabase } from "@/lib/supabase/client";
import { generateRoomCode } from "@/lib/room-code";
import { savePlayerId } from "@/lib/local-identity";

type Mode = "choose" | "create" | "join";

// Uno zatím není hotové - dokud na něm nezačneme pracovat, appka vytváří
// jen místnosti pro Prší.
const GAME_TYPE = "prsi";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Zadej jméno.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let room: { id: string; code: string } | null = null;
      for (let attempt = 0; attempt < 5 && !room; attempt++) {
        const code = generateRoomCode();
        const { data, error: insertError } = await supabase
          .from("rooms")
          .insert({ code, game_type: GAME_TYPE })
          .select("id, code")
          .single();
        if (!insertError) {
          room = data;
        } else if (insertError.code !== "23505") {
          // 23505 = unique_violation na code, zkusíme jiný kód
          throw insertError;
        }
      }
      if (!room) throw new Error("Nepodařilo se vygenerovat volný kód místnosti.");

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({ room_id: room.id, name: name.trim() })
        .select("id")
        .single();
      if (playerError) throw playerError;

      savePlayerId(room.code, player.id);
      router.push(`/hra/${room.code}`);
    } catch (err) {
      console.error(err);
      setError("Něco se nepovedlo. Zkus to prosím znovu.");
      setLoading(false);
    }
  }

  async function handleJoin() {
    const code = joinCode.trim().toLowerCase();
    if (!name.trim() || !code) {
      setError("Zadej jméno a kód místnosti.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("id, code")
        .eq("code", code)
        .maybeSingle();
      if (roomError) throw roomError;
      if (!room) {
        setError("Místnost s tímhle kódem neexistuje.");
        setLoading(false);
        return;
      }

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({ room_id: room.id, name: name.trim() })
        .select("id")
        .single();
      if (playerError) throw playerError;

      savePlayerId(room.code, player.id);
      router.push(`/hra/${room.code}`);
    } catch (err) {
      console.error(err);
      setError("Něco se nepovedlo. Zkus to prosím znovu.");
      setLoading(false);
    }
  }

  const titles = {
    choose: {
      title: "Začni hru",
      description: "Vytvoř místnost a nadiktuj kód, nebo se připoj ke kamarádovi.",
    },
    create: {
      title: "Nová místnost",
      description: "Zadej jméno — kód k nadiktování vznikne hned potom.",
    },
    join: {
      title: "Připoj se",
      description: "Stejný čtyřpísmenný kód, který ti řekl host.",
    },
  } as const;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <LobbyAtmosphere />
      <BrandMark />
      <Card className="relative w-full max-w-sm shadow-md ring-accent/25">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{titles[mode].title}</CardTitle>
          <CardDescription>{titles[mode].description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {mode === "choose" && (
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={() => setMode("create")}>
                Vytvořit místnost
              </Button>
              <Button size="lg" variant="outline" onClick={() => setMode("join")}>
                Připojit se do místnosti
              </Button>
            </div>
          )}

          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Tvoje jméno</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tvoje jméno"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setMode("choose")} disabled={loading}>
                  Zpět
                </Button>
                <Button className="flex-1" onClick={handleCreate} disabled={loading}>
                  {loading ? "Vytvářím…" : "Vytvořit"}
                </Button>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="join-name">Tvoje jméno</Label>
                <Input
                  id="join-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tvoje jméno"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="join-code">Kód místnosti</Label>
                <Input
                  id="join-code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
                  placeholder="hoka"
                  maxLength={4}
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-11 text-center font-mono text-lg tracking-[0.35em] lowercase"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setMode("choose")} disabled={loading}>
                  Zpět
                </Button>
                <Button className="flex-1" onClick={handleJoin} disabled={loading}>
                  {loading ? "Připojuji…" : "Připojit se"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="relative text-xs text-foreground/60">
        České karty · místnost pro dva hráče
      </p>
    </main>
  );
}
