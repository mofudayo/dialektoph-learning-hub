import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fakePronunciationScore, getLanguage, LANGUAGES, pronunciationFeedback } from "@/lib/data";

export const Route = createFileRoute("/practice")({
  validateSearch: (search: Record<string, unknown>): { lang?: string | undefined } => ({
    lang: typeof search["lang"] === "string" ? search["lang"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Practice – DialektoPH" },
      { name: "description", content: "Read words aloud and practice your pronunciation." },
      { property: "og:title", content: "Practice – DialektoPH" },
      { property: "og:description", content: "Read words aloud and practice your pronunciation." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const { lang } = Route.useSearch();
  const language = LANGUAGES.find((l) => l.id === lang);
  if (!language) return <LanguagePicker />;
  return <Practice key={language.id} languageId={language.id} />;
}

function LanguagePicker() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Practice</h1>
      <p className="text-sm text-muted-foreground">Choose a dialect to practice speaking.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {LANGUAGES.map((l) => (
          <Link
            key={l.id}
            to="/practice"
            search={{ lang: l.id }}
            className="rounded-xl border border-border bg-card p-8 text-center hover:bg-accent"
          >
            <div className="text-xl font-semibold">{l.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{l.region}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Practice({ languageId }: { languageId: string }) {
  const language = getLanguage(languageId);
  const phrases = language.lessons.flatMap((l) => l.phrases);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const phrase = phrases[index]!;

  // Demo only: pretend to listen for 2 seconds, then show a made-up score.
  function speak() {
    setScore(null);
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setScore(fakePronunciationScore());
    }, 2000);
  }

  function next() {
    setScore(null);
    setIndex((index + 1) % phrases.length);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Practice</h1>

      <Link to="/practice" search={{}} className="inline-block text-sm text-primary hover:underline">
        ← Choose another dialect
      </Link>

      <section className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {language.name} · Word {index + 1} of {phrases.length}
        </p>
        <p className="mt-4 text-3xl font-bold">{phrase.word}</p>
        <p className="mt-1 text-muted-foreground">{phrase.meaning}</p>

        <button
          onClick={speak}
          disabled={listening}
          aria-label="Read aloud"
          className={cn(
            "mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70",
            listening && "ring-4 ring-primary/30",
          )}
        >
          <Mic className="h-9 w-9" />
        </button>
        <p className="mt-3 text-sm text-muted-foreground">
          {listening ? "Listening..." : "Tap the mic and read the word aloud"}
        </p>

        {score !== null && (
          <div className="mt-6 space-y-1">
            <p className="text-2xl font-semibold text-primary">{score}%</p>
            <p className="text-sm">{pronunciationFeedback(score)}</p>
          </div>
        )}
      </section>

      <div className="flex gap-2">
        <Button onClick={next} disabled={listening}>
          Next word
        </Button>
      </div>
    </div>
  );
}
