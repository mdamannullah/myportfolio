import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Briefcase, Code, GraduationCap, BookOpen, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

/* ---------------------------
   STRICT LOCAL QA (edit me)
   --------------------------- */

type QAPair = { q: string; a: string; tags?: string[] };

const knowledge: QAPair[] = [
  // ==== About
  { q: "What is your full name?", a: "Md Amannullah.", tags: ["name","about","me","mohammad","mohammadullah","amanullah"] },
  { q: "Where are you from?", a: "Madhubani, Bihar (India).", tags: ["hometown","home","location","address","bihar"] },
  { q: "Languages you speak?", a: "English and Hindi; currently learning Tamil.", tags: ["language","speak","tongue"] },

  // ==== Family
  { q: "Tell me about your family.", a: "We’re a humble vendor family; my parents work hard and support my studies.", tags: ["family","parents","home"] },

  // ==== Academics
  { q: "Your current college and program?", a: "B.E. CSE (AI & ML) at AVS Engineering College, 2025 batch.", tags: ["college","course","program","branch","avs"] },
  { q: "Your 12th board details?", a: "JAC Class 12 (Science): 273/500 (2nd Division).", tags: ["12th","board","marks","jac"] },
  { q: "Future plan?", a: "Become an AI/ML engineer; build web+AI projects and compete in hackathons.", tags: ["goal","career","plan","future"] },

  // ==== Skills
  { q: "Your core skills?", a: "HTML, CSS, basic JavaScript/React; learning TypeScript, Tailwind, and AI APIs.", tags: ["skills","tech","stack"] },

  // ==== Projects
  { q: "Top project?", a: "AI Portfolio Chat — a portfolio with built-in Q&A about me and my work.", tags: ["project","portfolio","top"] },

  // ==== Contact
  { q: "How can I contact you?", a: "Email: you@example.com • GitHub: github.com/your-handle", tags: ["contact","email","github","reach"] },

  // 👉 Add more Q&A rows above. Keep answers short & factual.
];

const allowedTopics = [
  "About me",
  "Family",
  "Academics",
  "Skills",
  "Projects",
  "Experience",
  "Education timeline",
  "Contact",
];

const fallbackMessage =
  "Sorry, I don’t know about that. Please ask me about my family, academics, skills, projects, or contact.";

// tiny tokenizer + scorer
function tokens(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}
function scoreQuestion(userQ: string, item: QAPair) {
  const qT = new Set(tokens(userQ));
  const kT = new Set(tokens(item.q));
  let score = 0;
  for (const t of qT) if (kT.has(t)) score += 2;
  if (item.tags) for (const tag of item.tags) if (qT.has(tag.toLowerCase())) score += 1;
  if (userQ.toLowerCase().startsWith(item.q.toLowerCase().slice(0, 10))) score += 1;
  return score;
}
function askPortfolio(userQ: string): { answer: string; matched?: string; score: number } {
  const trimmed = userQ.trim();
  if (!trimmed) return { answer: fallbackMessage, score: 0 };
  const exact = knowledge.find(k => k.q.toLowerCase() === trimmed.toLowerCase());
  if (exact) return { answer: exact.a, matched: exact.q, score: 999 };
  let best: QAPair | null = null, bestScore = -1;
  for (const item of knowledge) {
    const s = scoreQuestion(trimmed, item);
    if (s > bestScore) { best = item; bestScore = s; }
  }
  const CONFIDENCE_THRESHOLD = 3; // raise to be stricter
  if (best && bestScore >= CONFIDENCE_THRESHOLD) return { answer: best.a, matched: best.q, score: bestScore };
  return { answer: `${fallbackMessage}\n\nTopics you can ask: ${allowedTopics.join(", ")}.`, score: bestScore };
}

/* ---------------------------
   PAGE UI
   --------------------------- */

const placeholders = [
  "I'm Mohammad's AI — ask me anything…",
  "Ask me about Mohammad's skills 🤖",
  "Curious about Mohammad's projects 🚀",
  "Learn about Mohammad's journey ✨",
  "Ask about Mohammad's education 🎓",
];

const quickActions = [
  { label: "Me", icon: User, path: "/chat/me" },
  { label: "Projects", icon: Briefcase, path: "/chat/projects" },
  { label: "Skills", icon: Code, path: "/chat/skills" },
  { label: "Experience", icon: BookOpen, path: "/chat/experience" },
  { label: "Education", icon: GraduationCap, path: "/chat/education" },
  { label: "Contact", icon: Mail, path: "/chat/contact" },
];

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I answer only about Mohammad — family, academics, skills, projects, and contact." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = inputValue.trim();
    if (!text || loading) return;
    setInputValue("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { answer } = askPortfolio(text);
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e?.message || "Something went wrong"}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
    // if you still want to deep-dive on Me page with same question:
    // navigate("/chat/me", { state: { query: inputValue } });
  };

  return (
    <div className="min-h-screen flex flex-col cursor-glow">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          Mohammad<span className="gradient-text">.AI</span>
        </motion.h1>
        <ThemeToggle />
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8 w-full max-w-3xl"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-card flex items-center justify-center shadow-lg border border-border">
            <span className="text-4xl font-bold text-foreground">M</span>
          </div>

          {/* Greeting */}
          <div className="text-center space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Hey, I'm Mohammad's 👋
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold"
            >
              AI Portfolio
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl"
            >
              🧑‍💻
            </motion.div>
          </div>

          {/* Input */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl relative"
          >
            <div className="relative w-full bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholders[currentPlaceholder]}
                className="w-full px-6 py-5 pr-16 bg-transparent outline-none text-foreground placeholder:text-muted-foreground transition-all"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e as any)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
                disabled={!inputValue.trim() || loading}
                aria-label="Send"
                title="Send"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.form>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="w-full max-w-2xl"
          >
            <div
              ref={scrollRef}
              className="border border-border rounded-3xl bg-card/60 dark:bg-black/30 shadow-lg p-4 h-[48vh] overflow-y-auto"
            >
              {messages.map((m, i) => (
                <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block px-3 py-2 rounded-2xl ${
                      m.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-zinc-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block px-3 py-2 rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse">
                    typing…
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:border-accent transition-all hover:scale-105 shadow-sm"
              >
                <action.icon className="w-4 h-4" />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}








// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { ArrowRight, User, Briefcase, Code, GraduationCap, BookOpen, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { Footer } from "@/components/Footer";

// const placeholders = [
//   "I'm Mohammad's AI — ask me anything…",
//   "Ask me about Mohammad's skills 🤖",
//   "Curious about Mohammad's projects 🚀",
//   "Learn about Mohammad's journey ✨",
//   "Ask about Mohammad's education 🎓",
// ];

// const quickActions = [
//   { label: "Me", icon: User, path: "/chat/me" },
//   { label: "Projects", icon: Briefcase, path: "/chat/projects" },
//   { label: "Skills", icon: Code, path: "/chat/skills" },
//   { label: "Experience", icon: BookOpen, path: "/chat/experience" },
//   { label: "Education", icon: GraduationCap, path: "/chat/education" },
//   { label: "Contact", icon: Mail, path: "/chat/contact" },
// ];

// export default function Home() {
//   const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
//   const [inputValue, setInputValue] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputValue.trim()) {
//       navigate("/chat/me", { state: { query: inputValue } });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col cursor-glow">
//       {/* Navbar */}
//       <nav className="w-full px-6 py-4 flex justify-between items-center">
//         <motion.h1
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-2xl font-bold"
//         >
//           Mohammad<span className="gradient-text">.AI</span>
//         </motion.h1>
//         <ThemeToggle />
//       </nav>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col items-center gap-8 w-full max-w-3xl"
//         >
//           {/* Avatar */}
//           <div className="w-24 h-24 rounded-3xl bg-card flex items-center justify-center shadow-lg border border-border">
//             <span className="text-4xl font-bold text-foreground">M</span>
//           </div>

//           {/* Greeting */}
//           <div className="text-center space-y-4">
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-xl text-muted-foreground"
//             >
//               Hey, I'm Mohammad's 👋
//             </motion.p>
//             <motion.h2
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-6xl font-bold"
//             >
//               AI Portfolio
//             </motion.h2>
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-6xl"
//             >
//               🧑‍💻
//             </motion.div>
//           </div>

//           {/* Search Input */}
//           <motion.form
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             onSubmit={handleSubmit}
//             className="w-full max-w-2xl relative"
//           >
//             <div className="relative w-full bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder={placeholders[currentPlaceholder]}
//                 className="w-full px-6 py-5 pr-16 bg-transparent outline-none text-foreground placeholder:text-muted-foreground transition-all"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
//               >
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//             </div>
//           </motion.form>

//           {/* Quick Actions */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="flex flex-wrap gap-3 justify-center"
//           >
//             {quickActions.map((action, index) => (
//               <motion.button
//                 key={action.label}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.7 + index * 0.05 }}
//                 onClick={() => navigate(action.path)}
//                 className="flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:border-accent transition-all hover:scale-105 shadow-sm"
//               >
//                 <action.icon className="w-4 h-4" />
//                 <span className="font-medium">{action.label}</span>
//               </motion.button>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }
