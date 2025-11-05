import { knowledge, allowedTopics, fallbackMessage, QAPair } from "@/data/my_knowledge";

// very small tokenizer
function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// quick score = overlap of tokens with question + tag bonuses
function scoreQuestion(userQ: string, item: QAPair) {
  const qT = new Set(tokens(userQ));
  const kT = new Set(tokens(item.q));
  let score = 0;

  for (const t of qT) if (kT.has(t)) score += 2;

  if (item.tags && item.tags.length) {
    for (const tag of item.tags) if (qT.has(tag.toLowerCase())) score += 1;
  }

  // tiny boost if question starts similarly
  if (userQ.toLowerCase().startsWith(item.q.toLowerCase().slice(0, 10))) score += 1;

  return score;
}

export function askPortfolio(userQ: string): { answer: string; matched?: string; score: number } {
  const trimmed = userQ.trim();
  if (!trimmed) return { answer: fallbackMessage, score: 0 };

  // direct exact match first
  const exact = knowledge.find(k => k.q.toLowerCase() === trimmed.toLowerCase());
  if (exact) return { answer: exact.a, matched: exact.q, score: 999 };

  // fuzzy best match
  let best: QAPair | null = null;
  let bestScore = -1;

  for (const item of knowledge) {
    const s = scoreQuestion(trimmed, item);
    if (s > bestScore) {
      best = item;
      bestScore = s;
    }
  }

  // strict gate: only answer if clearly matched
  const CONFIDENCE_THRESHOLD = 3; // tune: 2 = looser, 4 = stricter

  if (best && bestScore >= CONFIDENCE_THRESHOLD) {
    return { answer: best.a, matched: best.q, score: bestScore };
  }

  // refuse + suggest allowed topics
  const topics = allowedTopics.join(", ");
  return { answer: `${fallbackMessage}\n\nTopics you can ask: ${topics}.`, score: bestScore };
}
