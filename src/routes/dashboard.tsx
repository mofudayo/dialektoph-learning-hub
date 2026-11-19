import { createFileRoute, Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { LANGUAGES, TOTAL_LESSONS } from "@/lib/data";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – DialektoPH" },
      { name: "description", content: "Your DialektoPH learning progress and languages." },
      { property: "og:title", content: "Dashboard – DialektoPH" },
      { property: "og:description", content: "Your DialektoPH learning progress and languages." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { name, completed, scores } = useAppState();
  const percent = Math.round((completed.length / TOTAL_LESSONS) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {name}!</h1>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Learning progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {completed.length} of {TOTAL_LESSONS} lessons completed · Quizzes taken:{" "}
          {Object.keys(scores).length}
        </p>
        <Progress value={percent} className="mt-3" />
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Available languages</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LANGUAGES.map((lang) => {
            const done = lang.lessons.filter((l) => completed.includes(l.id)).length;
            return (
              <Link
                key={lang.id}
                to="/lessons"
                search={{ lang: lang.id }}
                className="rounded-xl border border-border bg-card p-4 hover:bg-accent"
              >
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm text-muted-foreground">
                  {lang.region} · {done}/{lang.lessons.length} lessons
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
