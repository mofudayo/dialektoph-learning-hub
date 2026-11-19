import { useSyncExternalStore } from "react";

// All demo data (login, profile, progress, class, theme) lives in one localStorage key.
export type AppState = {
  loggedIn: boolean;
  name: string;
  email: string;
  location: string;
  completed: string[];
  scores: Record<string, number>;
  classCode: string;
  theme: "light" | "dark";
  remember: boolean;
};

const KEY = "dialektoph";
// Marks this browser tab session; used when "Remember me" is off.
const SESSION_KEY = "dialektoph-session";

export const DEFAULT_STATE: AppState = {
  loggedIn: false,
  name: "Learner",
  email: "",
  location: "",
  completed: [],
  scores: {},
  classCode: "",
  theme: "light",
  remember: true,
};

let cacheRaw: string | null = null;
let cache: AppState = DEFAULT_STATE;
const listeners = new Set<() => void>();

export function getState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  const raw = localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
    } catch {
      cache = DEFAULT_STATE;
    }
  }
  return cache;
}

export function setState(patch: Partial<AppState>) {
  localStorage.setItem(KEY, JSON.stringify({ ...getState(), ...patch }));
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, () => DEFAULT_STATE);
}

/** Demo sign-in: no real account, just saves the details and the login flag. */
export function signIn(patch: Partial<AppState>, remember: boolean) {
  sessionStorage.setItem(SESSION_KEY, "1");
  setState({ ...patch, remember, loggedIn: true });
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  setState({ loggedIn: false });
}

/** True when signed in. Without "Remember me", closing the browser signs you out. */
export function hasActiveSession(): boolean {
  const s = getState();
  if (s.loggedIn && !s.remember && !sessionStorage.getItem(SESSION_KEY)) {
    setState({ loggedIn: false });
    return false;
  }
  return s.loggedIn;
}
