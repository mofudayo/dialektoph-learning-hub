import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getLanguage, LANGUAGES } from "@/lib/data";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/lessons")({
  validateSearch: (search: Record<string, unknown>): { lang?: string | undefined } => ({
    lang: typeof search['lang'] === "string" ? search['lang'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Lessons – DialektoPH" },
      { name: "description", content: "Lessons in Tagalog, Cebuano, Ilocano, Hiligaynon and Waray." },
      { property: "og:title", content: "Lessons – DialektoPH" },
      { property: "og:description", content: "Lessons in Tagalog, Cebuano, Ilocano, Hiligaynon and Waray." },
    ],
  }),
  component: Lessons,
});

function Lessons() {
  const { lang } = Route.useSearch();
  const language = getLanguage(lang);
  const { completed } = useAppState();

  function toggle(id: string) {
    setState({
      completed: completed.includes(id) ? completed.filter((c) => c !== id) : [...completed, id],
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lessons</h1>

      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((l) => (
          <Button key={l.id} asChild size="sm" variant={l.id === language.id ? "default" : "outline"}>
            <Link to="/lessons" search={{ lang: l.id }}>
              {l.name}
            </Link>
          </Button>
        ))}
      </div>

      {language.lessons.map((lesson) => {
        const done = completed.includes(lesson.id);
        return (
          <section key={lesson.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold">
                {language.name}: {lesson.title}
              </h2>
              <Button size="sm" variant={done ? "secondary" : "default"} onClick={() => toggle(lesson.id)}>
                {done ? "Completed ✓" : "Mark as complete"}
              </Button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {lesson.phrases.map((p) => (
                <li key={p.word} className="flex justify-between py-2 text-sm">
                  <span className="font-medium">{p.word}</span>
                  <span className="text-muted-foreground">{p.meaning}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <Button asChild variant="outline">
        <Link to="/quiz" search={{ lang: language.id }}>
          Take the {language.name} quiz
        </Link>
      </Button>
    </div>
  );
}
