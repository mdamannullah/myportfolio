// Put YOUR real info here.
// Keep answers short and factual. You can use markdown.

export type QAPair = {
  q: string;         // the canonical question
  a: string;         // the answer text
  tags?: string[];   // keywords to help match
};

export const knowledge: QAPair[] = [
  // About you
  { q: "What is your full name?", a: "Md Amannullah.", tags: ["name","about","me"] },
  { q: "Where are you from?", a: "I’m from Madhubani, Bihar (INDIA).", tags: ["hometown","location","address"] },
  { q: "Languages you speak?", a: "English, Hindi; learning Tamil.", tags: ["language","speak"] },

  // Family
  { q: "Tell me about your family.", a: "We’re a humble vendor family; parents work hard and support my studies.", tags: ["family","parents","home"] },

  // Academics
  { q: "Your current college and program?", a: "B.E. CSE (AI & ML) — AVS Engineering College, 2025 batch.", tags: ["college","course","program","branch"] },
  { q: "Your 12th board details?", a: "JAC Class 12 Science: 273/500 (2nd Division).", tags: ["12th","board","marks","jac"] },
  { q: "Future plan?", a: "Aim: AI/ML engineer. Focus on web + AI projects and competitive hackathons.", tags: ["goal","career","plan"] },

  // Skills
  { q: "Your core skills?", a: "HTML, CSS, basic JS/React; learning TypeScript, Tailwind, and AI APIs.", tags: ["skills","tech","stack"] },

  // Projects (example)
  { q: "Top project?", a: "AI Portfolio Chat — a portfolio with built-in Q&A about me and my work.", tags: ["project","portfolio"] },

  // Contact
  { q: "How can I contact you?", a: "Email: you@example.com | GitHub: github.com/<your-handle>.", tags: ["contact","email","github"] },

  // Add as many Q&A as you want… (family specifics, awards, certifications, internships, hobbies, etc.)
];

// Optional: show users what they CAN ask.
export const allowedTopics = [
  "About me", "Family", "Academics", "Skills", "Projects", "Experience",
  "Achievements", "Education timeline", "Contact"
];

// Friendly fallback
export const fallbackMessage =
  "Sorry, I don’t know about that. Please ask me about my family, academics, skills, projects, or contact.";
