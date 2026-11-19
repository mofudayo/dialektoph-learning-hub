import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setState, useAppState } from "@/lib/store";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/lessons", label: "Lessons" },
  { to: "/practice", label: "Practice" },
  { to: "/quiz", label: "Quiz" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
] as const;

export function Nav() {
  const { theme } = useAppState();
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold text-primary">
          DialektoPH
        </Link>
        <nav className="flex flex-1 flex-wrap gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle dark mode"
          onClick={() => setState({ theme: theme === "dark" ? "light" : "dark" })}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
}
