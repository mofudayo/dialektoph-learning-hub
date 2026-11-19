import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_STATE, setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile – DialektoPH" },
      { name: "description", content: "View and edit your DialektoPH learner profile." },
      { property: "og:title", content: "Profile – DialektoPH" },
      { property: "og:description", content: "View and edit your DialektoPH learner profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const state = useAppState();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: state.name, email: state.email, location: state.location });
  const [saved, setSaved] = useState(false);

  // Fill the form once saved data has loaded in the browser.
  useEffect(() => {
    setForm({ name: state.name, email: state.email, location: state.location });
  }, [state.name, state.email, state.location]);

  function save(e: FormEvent) {
    e.preventDefault();
    setState({ ...form, name: form.name.trim() || "Learner" });
    setSaved(true);
  }

  function signOut() {
    setState({ loggedIn: false });
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-card p-5">
        {(["name", "email", "location"] as const).map((field) => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={field} className="capitalize">
              {field}
            </Label>
            <Input
              id={field}
              type={field === "email" ? "email" : "text"}
              value={form[field]}
              placeholder={field === "location" ? "e.g. Cebu City" : DEFAULT_STATE[field] || ""}
              onChange={(e) => {
                setForm({ ...form, [field]: e.target.value });
                setSaved(false);
              }}
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button type="submit">Save</Button>
          {saved && <span className="text-sm text-muted-foreground">Saved!</span>}
        </div>
      </form>
      <Button variant="outline" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
