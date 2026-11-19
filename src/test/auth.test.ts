import { describe, expect, it } from "vitest";
import { validateAuth } from "@/lib/auth";

describe("demo sign-in checks", () => {
  it("accepts any valid email with a 6-character password", () => {
    expect(validateAuth("login", { email: "ana@example.com", password: "123456" })).toBeNull();
  });

  it("rejects a badly formed email", () => {
    expect(validateAuth("login", { email: "ana@", password: "123456" })).toMatch(/email/);
  });

  it("rejects a password shorter than 6 characters", () => {
    expect(validateAuth("login", { email: "ana@example.com", password: "12345" })).toMatch(/6/);
  });

  it("requires a name when creating an account", () => {
    expect(validateAuth("signup", { name: " ", email: "ana@example.com", password: "123456" })).toMatch(/name/);
  });
});
