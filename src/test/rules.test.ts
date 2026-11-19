import { describe, expect, it } from "vitest";
import { calcPoints, getQuiz, LANGUAGES, scoreQuiz } from "@/lib/data";

describe("DialektoPH rules", () => {
  it("offers lessons for the five requested languages", () => {
    expect(LANGUAGES.map((l) => l.name)).toEqual(["Tagalog", "Cebuano", "Ilocano", "Hiligaynon", "Waray"]);
  });

  it("every quiz question has 4 distinct options including the answer", () => {
    for (const lang of LANGUAGES) {
      for (const q of getQuiz(lang.id)) {
        expect(new Set(q.options).size).toBe(4);
        expect(q.options).toContain(q.answer);
      }
    }
  });

  it("scores one point per correct answer", () => {
    const qs = getQuiz("tagalog");
    expect(scoreQuiz(qs, { 0: qs[0]!.answer, 1: qs[1]!.answer, 2: "wrong" })).toBe(2);
  });

  it("gives 10 points per lesson and 5 per correct quiz answer", () => {
    expect(calcPoints(["a", "b"], { tagalog: 3, waray: 1 })).toBe(40);
  });
});
