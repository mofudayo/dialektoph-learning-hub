import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getState, setState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in – DialektoPH" },
      { name: "description", content: "Learn Philippine languages with simple lessons and quizzes." },
      { property: "og:title", content: "DialektoPH" },
      { property: "og:description", content: "Learn Philippine languages with simple lessons and quizzes." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getState().loggedIn) navigate({ to: "/dashboard" });
  }, [navigate]);

  function signIn() {
    setState({ loggedIn: true });
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-3xl font-bold text-primary">DialektoPH</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Learn Tagalog, Cebuano, Ilocano, Hiligaynon and Waray.
        </p>
        <Button className="mt-8 w-full" size="lg" onClick={signIn}>
          Sign In
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Demo only — no account needed.</p>
      </div>
    </main>
  );
}
