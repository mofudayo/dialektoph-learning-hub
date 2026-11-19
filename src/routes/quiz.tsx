import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLanguage, getQuiz, LANGUAGES, scoreQuiz } from "@/lib/data";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/quiz")({
  validateSearch: (search: Record<string, unknown>): { lang?: string | undefined } => ({
    lang: typeof search['lang'] === "string" ? search['lang'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Quiz – DialektoPH" },
      { name: "description", content: "Test yourself with simple multiple-choice quizzes." },
      { property: "og:title", content: "Quiz – DialektoPH" },
      { property: "og:description", content: "Test yourself with simple multiple-choice quizzes." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { lang } = Route.useSearch();
  const language = LANGUAGES.find((l) => l.id === lang);
  // No dialect picked yet: show only the big dialect selection.
  if (!language) return <LanguagePicker />;
  // Remount the quiz when the language changes so answers reset.
  return <Quiz key={language.id} languageId={language.id} />;
}

function LanguagePicker() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <p className="text-sm text-muted-foreground">Choose a dialect to start its quiz.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {LANGUAGES.map((l) => (
          <Link
            key={l.id}
            to="/quiz"
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

function Quiz({ languageId }: { languageId: string }) {
  const language = getLanguage(languageId);
  const questions = getQuiz(languageId);
  const { scores } = useAppState();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = scoreQuiz(questions, answers);
  const best = scores[languageId];

  function submit() {
    setSubmitted(true);
    if (best === undefined || score > best) setState({ scores: { ...scores, [languageId]: score } });
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quiz</h1>

      <Link to="/quiz" search={{}} className="inline-block text-sm text-primary hover:underline">
        ← Choose another dialect
      </Link>

      <p className="text-sm text-muted-foreground">
        Best score in {language.name}: {best === undefined ? "not taken yet" : `${best}/${questions.length}`}
      </p>

      {questions.map((q, i) => (
        <section key={q.prompt} className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-medium">
            {i + 1}. {q.prompt}
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((opt) => {
              const picked = answers[i] === opt;
              const correct = submitted && opt === q.answer;
              const wrong = submitted && picked && opt !== q.answer;
              return (
                <button
                  key={opt}
                  disabled={submitted}
                  onClick={() => setAnswers({ ...answers, [i]: opt })}
                  className={cn(
                    "rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-accent disabled:cursor-default",
                    picked && "border-primary bg-accent",
                    correct && "border-primary bg-primary text-primary-foreground",
                    wrong && "border-destructive bg-destructive text-destructive-foreground",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {submitted ? (
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold">
            Score: {score}/{questions.length}
          </p>
          <Button onClick={retry}>Try again</Button>
        </div>
      ) : (
        <Button onClick={submit} disabled={Object.keys(answers).length < questions.length}>
          Submit answers
        </Button>
      )}
    </div>
  );
}
