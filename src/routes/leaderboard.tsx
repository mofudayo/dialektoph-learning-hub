import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calcPoints, CLASSMATES } from "@/lib/data";
import { setState, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard – DialektoPH" },
      { name: "description", content: "Join a class and see how you rank against classmates." },
      { property: "og:title", content: "Leaderboard – DialektoPH" },
      { property: "og:description", content: "Join a class and see how you rank against classmates." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { classCode, name, completed, scores } = useAppState();
  const [code, setCode] = useState("");

  function join(e: FormEvent) {
    e.preventDefault();
    if (code.trim()) setState({ classCode: code.trim().toUpperCase() });
  }

  if (!classCode) {
    return (
      <div className="mx-auto max-w-sm space-y-4 pt-8 text-center">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Join a class with a class code to see the leaderboard. Any code works in this demo.
        </p>
        <form onSubmit={join} className="flex gap-2">
          <Input placeholder="Class code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button type="submit" disabled={!code.trim()}>
            Join
          </Button>
        </form>
      </div>
    );
  }

  const rows = [...CLASSMATES, { name: `${name} (you)`, points: calcPoints(completed, scores), me: true }]
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Class {classCode}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setState({ classCode: "" })}>
          Leave class
        </Button>
      </div>
      <ol className="divide-y divide-border rounded-xl border border-border bg-card">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className={cn("flex items-center gap-4 px-5 py-3", "me" in r && "bg-accent font-semibold")}
          >
            <span className="w-6 text-muted-foreground">{i + 1}</span>
            <span className="flex-1">{r.name}</span>
            <span>{r.points} pts</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">
        10 points per completed lesson, 5 points per correct quiz answer.
      </p>
    </div>
  );
}
