import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidEmail, validateAuth, type AuthMode } from "@/lib/auth";
import { hasActiveSession, signIn } from "@/lib/store";
import appleLogoWhite from "@/assets/apple-logo-white.svg";
import appleLogoBlack from "@/assets/apple-logo-black.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in – DialektoPH" },
      { name: "description", content: "Log in or create a DialektoPH account to learn Philippine languages." },
      { property: "og:title", content: "Sign in – DialektoPH" },
      { property: "og:description", content: "Log in or create a DialektoPH account to learn Philippine languages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const GOOGLE_G = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

const FACEBOOK_F = (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

// Provider buttons use each brand's own colors, as their guidelines require.
const providerBase = "flex h-11 w-full items-center justify-center rounded-md transition-opacity hover:opacity-90";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasActiveSession()) navigate({ to: "/dashboard" });
  }, [navigate]);

  function update(field: keyof typeof form, value: string) {
    setForm({ ...form, [field]: value });
    setError(null);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const problem = validateAuth(mode, form);
    if (problem) return setError(problem);
    signIn(
      mode === "signup" ? { name: form.name.trim(), email: form.email.trim() } : { email: form.email.trim() },
      remember,
    );
    navigate({ to: "/dashboard" });
  }

  // Demo social sign-in: no real Google/Apple/Facebook account is used.
  function socialSignIn() {
    signIn({}, remember);
    navigate({ to: "/dashboard" });
  }

  function sendReset(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");
    setResetSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">DialektoPH</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Learn Tagalog, Cebuano, Ilocano, Hiligaynon and Waray.
          </p>
        </div>

        {forgot ? (
          <form onSubmit={sendReset} className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold">Reset your password</h2>
            {resetSent ? (
              <p className="rounded-md bg-accent p-3 text-sm text-accent-foreground">
                If an account exists for {form.email}, a reset link is on its way. (Demo only — no email is sent.)
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={form.email}
                    placeholder="you@example.com"
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
              </>
            )}
            <button
              type="button"
              className="w-full text-center text-sm text-primary hover:underline"
              onClick={() => {
                setForgot(false);
                setResetSent(false);
                setError(null);
              }}
            >
              Back to log in
            </button>
          </form>
        ) : (
          <>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as AuthMode);
                setError(null);
              }}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={submit} className="mt-5 space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} placeholder="Juan dela Cruz" onChange={(e) => update("name", e.target.value)} />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => {
                        setForgot(true);
                        setError(null);
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={form.password}
                  placeholder="At least 6 characters"
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                <Label htmlFor="remember" className="font-normal">
                  Remember me
                </Label>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                {mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={socialSignIn}
                className={`${providerBase} gap-2.5 border border-[#747775] bg-[#FFFFFF] px-3 text-[#1F1F1F] dark:border-[#8E918F] dark:bg-[#131314] dark:text-[#E3E3E3]`}
              >
                {GOOGLE_G}
                <span className="text-sm leading-5 font-medium" style={{ fontFamily: "'Google Sans', Nunito, sans-serif" }}>
                  Continue with Google
                </span>
              </button>
              <button
                type="button"
                onClick={socialSignIn}
                className={`${providerBase} bg-[#000000] pr-4 text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]`}
              >
                <img src={appleLogoWhite} alt="" className="h-11 w-auto dark:hidden" />
                <img src={appleLogoBlack} alt="" className="hidden h-11 w-auto dark:block" />
                <span className="text-[19px] font-medium" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>
                  Continue with Apple
                </span>
              </button>
              <button
                type="button"
                onClick={socialSignIn}
                className={`${providerBase} gap-2.5 bg-[#1877F2] px-3 text-[#FFFFFF]`}
              >
                {FACEBOOK_F}
                <span className="text-sm leading-5 font-semibold">Continue with Facebook</span>
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Demo only — any email and password work. Nothing is sent anywhere.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
