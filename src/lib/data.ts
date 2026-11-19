export type Phrase = { word: string; meaning: string };
export type Lesson = { id: string; title: string; phrases: Phrase[] };
export type Language = { id: string; name: string; region: string; lessons: Lesson[] };

function basics(id: string, greet: Phrase[], words: Phrase[]): Lesson[] {
  return [
    { id: `${id}-greetings`, title: "Greetings", phrases: greet },
    { id: `${id}-basics`, title: "Basic Words", phrases: words },
  ];
}

export const LANGUAGES: Language[] = [
  {
    id: "tagalog",
    name: "Tagalog",
    region: "Luzon",
    lessons: basics(
      "tagalog",
      [
        { word: "Magandang umaga", meaning: "Good morning" },
        { word: "Kumusta ka?", meaning: "How are you?" },
        { word: "Salamat", meaning: "Thank you" },
        { word: "Paalam", meaning: "Goodbye" },
      ],
      [
        { word: "Oo", meaning: "Yes" },
        { word: "Hindi", meaning: "No" },
        { word: "Tubig", meaning: "Water" },
        { word: "Pagkain", meaning: "Food" },
      ],
    ),
  },
  {
    id: "cebuano",
    name: "Cebuano",
    region: "Central Visayas & Mindanao",
    lessons: basics(
      "cebuano",
      [
        { word: "Maayong buntag", meaning: "Good morning" },
        { word: "Kumusta ka?", meaning: "How are you?" },
        { word: "Salamat", meaning: "Thank you" },
        { word: "Amping", meaning: "Take care" },
      ],
      [
        { word: "Oo", meaning: "Yes" },
        { word: "Dili", meaning: "No" },
        { word: "Tubig", meaning: "Water" },
        { word: "Pagkaon", meaning: "Food" },
      ],
    ),
  },
  {
    id: "ilocano",
    name: "Ilocano",
    region: "Northern Luzon",
    lessons: basics(
      "ilocano",
      [
        { word: "Naimbag a bigat", meaning: "Good morning" },
        { word: "Kumusta ka?", meaning: "How are you?" },
        { word: "Agyamanak", meaning: "Thank you" },
        { word: "Ag-annad ka", meaning: "Take care" },
      ],
      [
        { word: "Wen", meaning: "Yes" },
        { word: "Saan", meaning: "No" },
        { word: "Danum", meaning: "Water" },
        { word: "Makan", meaning: "Food" },
      ],
    ),
  },
  {
    id: "hiligaynon",
    name: "Hiligaynon",
    region: "Western Visayas",
    lessons: basics(
      "hiligaynon",
      [
        { word: "Maayong aga", meaning: "Good morning" },
        { word: "Kamusta ka?", meaning: "How are you?" },
        { word: "Salamat", meaning: "Thank you" },
        { word: "Halong", meaning: "Take care" },
      ],
      [
        { word: "Huo", meaning: "Yes" },
        { word: "Indi", meaning: "No" },
        { word: "Tubig", meaning: "Water" },
        { word: "Pagkaon", meaning: "Food" },
      ],
    ),
  },
  {
    id: "waray",
    name: "Waray",
    region: "Eastern Visayas",
    lessons: basics(
      "waray",
      [
        { word: "Maupay nga aga", meaning: "Good morning" },
        { word: "Kumusta ka?", meaning: "How are you?" },
        { word: "Salamat", meaning: "Thank you" },
        { word: "Pag-amping", meaning: "Take care" },
      ],
      [
        { word: "Oo", meaning: "Yes" },
        { word: "Diri", meaning: "No" },
        { word: "Tubig", meaning: "Water" },
        { word: "Pagkaon", meaning: "Food" },
      ],
    ),
  },
];

export const TOTAL_LESSONS = LANGUAGES.reduce((n, l) => n + l.lessons.length, 0);

export function getLanguage(id: string | undefined): Language {
  return LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0]!;
}

export type Question = { prompt: string; options: string[]; answer: string };

// One question per phrase: "What does X mean?" with 4 options from the same language.
export function getQuiz(languageId: string): Question[] {
  const phrases = getLanguage(languageId).lessons.flatMap((l) => l.phrases);
  const meanings = phrases.map((p) => p.meaning);
  return phrases.map((p, i) => {
    const others = meanings.filter((m) => m !== p.meaning);
    const wrong = [0, 2, 4].map((k) => others[(i + k) % others.length]!);
    return {
      prompt: `What does "${p.word}" mean?`,
      options: [p.meaning, ...wrong].sort(),
      answer: p.meaning,
    };
  });
}

export function scoreQuiz(questions: Question[], answers: Record<number, string>): number {
  return questions.filter((q, i) => answers[i] === q.answer).length;
}

// Leaderboard points: 10 per completed lesson + 5 per correct quiz answer (best attempt).
export function calcPoints(completed: string[], scores: Record<string, number>): number {
  return completed.length * 10 + Object.values(scores).reduce((a, b) => a + b, 0) * 5;
}

export const CLASSMATES = [
  { name: "Maria Santos", points: 120 },
  { name: "Jose Reyes", points: 95 },
  { name: "Ana Dela Cruz", points: 80 },
  { name: "Paolo Garcia", points: 55 },
  { name: "Liza Ramos", points: 30 },
];

// Practice (demo): no real speech check, just a made-up score from 60 to 100.
export function fakePronunciationScore(): number {
  return 60 + Math.floor(Math.random() * 41);
}

export function pronunciationFeedback(score: number): string {
  if (score >= 90) return "Excellent! You sound like a native speaker.";
  if (score >= 75) return "Good job! Just a little more practice.";
  return "Nice try! Listen again and repeat slowly.";
}
