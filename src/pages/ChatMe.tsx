import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { aboutMe } from "@/data/portfolioData";
import { Footer } from "@/components/Footer";
import { TypingEffect } from "@/components/TypingEffect";
import { useState, useEffect, useRef } from "react";

/* ---------------------------
   STRICT LOCAL QA (tagged)
   --------------------------- */
type QAPair = { q: string; a: string; tags?: string[] };

const knowledge: QAPair[] = [
  { q: "What is your full name?", a: "Md Amannullah.", tags: ["about"] },
  { q: "Where are you from?", a: "Madhubani, Bihar (India).", tags: ["about"] },
  { q: "Languages you speak?", a: "English and Hindi; currently learning Tamil.", tags: ["about"] },
  { q: "Tell me about your family.", a: "We’re a humble vendor family; my parents work hard and support my studies.", tags: ["family"] },
  { q: "Your current college and program?", a: "B.E. CSE (AI & ML) at AVS Engineering College, 2025 batch.", tags: ["education"] },
  { q: "Your 12th board details?", a: "JAC Class 12 (Science): 273/500 (2nd Division).", tags: ["education"] },
  { q: "Future plan?", a: "Become an AI/ML engineer; build web+AI projects and compete in hackathons.", tags: ["about"] },
  { q: "Your core skills?", a: "HTML, CSS, basic JavaScript/React; learning TypeScript and AI APIs.", tags: ["skills"] },
  { q: "Top project?", a: "AI Portfolio Chat — this exact project!", tags: ["projects"] },
  { q: "How can I contact you?", a: "Email: you@example.com • GitHub: github.com/your-handle", tags: ["contact"] },
];

const fallbackMessage =
  "Sorry, I don’t know about that. Ask me about Mohammad’s family, academics, skills, projects, or contact.";

function tokens(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}
function score(userQ: string, item: QAPair) {
  let sc = 0;
  const qT = new Set(tokens(userQ));
  const aT = new Set(tokens(item.q));
  for (const t of qT) if (aT.has(t)) sc += 2;
  if (item.tags) for (const tag of item.tags) if (qT.has(tag.toLowerCase())) sc += 1;
  if (userQ.toLowerCase().startsWith(item.q.toLowerCase().slice(0, 10))) sc += 1;
  return sc;
}
function askPortfolio(q: string): { answer: string; category: string } {
  const text = q.trim();
  if (!text) return { answer: fallbackMessage, category: "other" };
  let best: QAPair | null = null;
  let bestScore = -1;
  for (const item of knowledge) {
    const s = score(text, item);
    if (s > bestScore) { best = item; bestScore = s; }
  }
  if (bestScore >= 3 && best) {
    const category = best.tags?.[0] ?? "other";
    return { answer: best.a, category };
  }
  return { answer: fallbackMessage, category: "other" };
}

/* ---------------------------
   COMPONENT
   --------------------------- */

type Msg = { role: "user" | "assistant"; content: string; category?: string };

export default function ChatMe() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { query?: string } };

  const [showContent, setShowContent] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introText = `💡 Here's a bit about me!

👨‍💻 Name: ${aboutMe.name}
🎯 Focus: ${aboutMe.focus.join(", ")}
💬 Passion: ${aboutMe.passion}

${aboutMe.bio}`;

  // scroll to bottom on update
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // send helper
  const send = (forced?: string) => {
    const text = (forced ?? inputValue).trim();
    if (!text || loading) return;
    setInputValue("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    setTimeout(() => {
      const { answer, category } = askPortfolio(text);
      setMessages((m) => [...m, { role: "assistant", content: answer, category }]);
      setLoading(false);
    }, 300);
  };

  // get query from Home and auto-send
  useEffect(() => {
    const q = location.state?.query;
    if (q) {
      setShowContent(true);
      setTimeout(() => send(q), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- UI helpers (pretty messages) ----------------
  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1 rounded-full text-sm bg-indigo-600 text-white">{children}</span>
  );

  const SectionCard = ({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-white/70 dark:bg-zinc-900/60 shadow-sm p-4">
      <div className="mb-3 font-semibold flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );

  function renderAssistant(msg: Msg, i: number) {
    const content = msg.content;

    // format by category
    if (msg.category === "skills") {
      const skills = content.split(/[;,•|]/).map(s => s.trim()).filter(Boolean);
      return (
        <SectionCard key={i} title="Skills" emoji="🧠">
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 text-sm">
                {s}
              </span>
            ))}
          </div>
        </SectionCard>
      );
    }

    if (msg.category === "education") {
      // simple split into lines if any
      const lines = content.split("\n").filter(Boolean);
      return (
        <SectionCard key={i} title="Education" emoji="🎓">
          <ul className="space-y-2">
            {lines.map((l, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1">📘</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      );
    }

    if (msg.category === "projects") {
      return (
        <SectionCard key={i} title="Project" emoji="🚀">
          <p>{content}</p>
        </SectionCard>
      );
    }

    if (msg.category === "contact") {
      // try to make links clickable
      const withLinks = content.replace(
        /(https?:\/\/[^\s]+|github\.com\/[^\s]+)/gi,
        (m) => `<a class="underline" href="${m.startsWith('http') ? m : 'https://' + m}" target="_blank" rel="noreferrer">${m}</a>`
      );
      return (
        <SectionCard key={i} title="Contact" emoji="✉️">
          <p dangerouslySetInnerHTML={{ __html: withLinks }} />
        </SectionCard>
      );
    }

    if (msg.content === fallbackMessage) {
      return (
        <SectionCard key={i} title="I don’t know this one" emoji="🤝">
          <p>{fallbackMessage}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>About</Pill>
            <Pill>Family</Pill>
            <Pill>Education</Pill>
            <Pill>Skills</Pill>
            <Pill>Projects</Pill>
            <Pill>Contact</Pill>
          </div>
        </SectionCard>
      );
    }

    // default bubble
    return (
      <div key={i} className="text-left">
        <div className="inline-block px-3 py-2 rounded-2xl bg-gray-200 dark:bg-zinc-800">
          {content}
        </div>
      </div>
    );
  }

  // small when empty; grows only when messages appear
  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">About Me</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI Active</span>
          </div>
        </div>
      </div>

      {/* Intro / Chat */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {!showContent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-lg">
            <TypingEffect text={introText} speed={15} onComplete={() => setShowContent(true)} />
          </motion.div>
        )}

        {showContent && (
          <>
            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className={[
                "bg-card border border-border rounded-3xl p-6 shadow-lg overflow-y-auto transition-all",
                isEmpty ? "min-h-[120px] max-h-[50vh]" : "max-h-[60vh]"
              ].join(" ")}
            >
              {isEmpty && (
                <p className="text-muted-foreground">
                  ✨ Ask me anything about Mohammad — family, college, marks, skills…
                </p>
              )}

              {/* render each message */}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="mb-3 text-right">
                    <div className="inline-block px-3 py-2 rounded-2xl bg-indigo-600 text-white">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="mb-3">{renderAssistant(m, i)}</div>
                )
              )}

              {loading && (
                <div className="text-left">
                  <div className="inline-block px-3 py-2 rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse">
                    typing…
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-4">
              <div className="bg-card/80 backdrop-blur-lg border border-border rounded-3xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Ask Mohammad.AI..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => send()}
                    disabled={!inputValue.trim() || loading}
                    className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}









// import { motion } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { aboutMe } from "@/data/portfolioData";
// import { Footer } from "@/components/Footer";
// import { TypingEffect } from "@/components/TypingEffect";
// import { useState } from "react";

// export default function ChatMe() {
//   const navigate = useNavigate();
//   const [showContent, setShowContent] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   const introText = `💡 Here's a bit about me!\n\n👨‍💻 Name: ${aboutMe.name}\n🎯 Focus: ${aboutMe.focus.join(", ")}\n💬 Passion: ${aboutMe.passion}\n\n${aboutMe.bio}`;

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={() => navigate("/")}
//             className="p-2 hover:bg-muted rounded-full transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-lg font-semibold">About Me</h1>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//             <span className="text-sm text-muted-foreground">AI Active</span>
//           </div>
//         </div>
//       </div>

//       {/* Chat Content */}
//       <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card border border-border rounded-3xl p-6 shadow-lg"
//         >
//           <div className="whitespace-pre-line text-foreground">
//             <TypingEffect text={introText} speed={15} onComplete={() => setShowContent(true)} />
//           </div>
//         </motion.div>

//         {showContent && (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-card border border-border rounded-3xl p-6 shadow-lg"
//             >
//               <p className="text-muted-foreground">
//                 ✨ Would you like to explore my Skills or Experience next?
//               </p>
//             </motion.div>

//             {/* Chat Input */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="sticky bottom-4"
//             >
//               <div className="bg-card/80 backdrop-blur-lg border border-border rounded-3xl p-4 shadow-lg">
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         console.log("Sending message:", inputValue);
//                         setInputValue("");
//                       }
//                     }}
//                     placeholder="Continue chatting with Mohammed.AI..."
//                     className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
//                   />
//                   <button 
//                     onClick={() => {
//                       console.log("Sending message:", inputValue);
//                       setInputValue("");
//                     }}
//                     className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform"
//                   >
//                     <ArrowRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }
