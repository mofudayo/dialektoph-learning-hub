// Demo-only sign-in checks. Nothing is sent anywhere: any well-formed details are accepted.
export type AuthMode = "login" | "signup";

export const MIN_PASSWORD = 6;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Returns an error message, or null when the form can be submitted. */
export function validateAuth(
  mode: AuthMode,
  { name = "", email, password }: { name?: string; email: string; password: string },
): string | null {
  if (mode === "signup" && !name.trim()) return "Please enter your name.";
  if (!isValidEmail(email)) return "Please enter a valid email address.";
  if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
  return null;
}
