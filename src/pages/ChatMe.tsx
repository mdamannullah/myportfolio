import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aboutMe } from "@/data/portfolioData";
import { Footer } from "@/components/Footer";
import { TypingEffect } from "@/components/TypingEffect";
import { useState, useEffect, useRef } from "react";

/* ---------------------------
   STRICT LOCAL QA (same as Home)
   --------------------------- */
type QAPair = { q: string; a: string; tags?: string[] };

const knowledge: QAPair[] = [
  { q: "What is your full name?", a: "Md Amannullah.", tags: ["name", "about", "me"] },
  { q: "Where are you from?", a: "Madhubani, Bihar (India).", tags: ["hometown", "bihar"] },
  { q: "Languages you speak?", a: "English and Hindi; currently learning Tamil.", tags: ["language"] },
  { q: "Tell me about your family.", a: "We’re a humble vendor family; my parents work hard and support my studies.", tags: ["family"] },
  { q: "Your current college and program?", a: "B.E. CSE (AI & ML) at AVS Engineering College, 2025 batch.", tags: ["college","avs"] },
  { q: "Your 12th board details?", a: "JAC Class 12 (Science): 273/500 (2nd Division).", tags: ["12th", "marks","jac"] },
  { q: "Future plan?", a: "Become an AI/ML engineer; build web+AI projects and compete in hackathons.", tags: ["future","goal"] },
  { q: "Your core skills?", a: "HTML, CSS, basic JavaScript/React; learning TypeScript and AI APIs.", tags: ["skills"] },
  { q: "Top project?", a: "AI Portfolio Chat — this exact project!", tags: ["project"] },
  { q: "How can I contact you?", a: "Email: you@example.com • GitHub: github.com/your-handle", tags: ["contact"] },
];

const fallbackMessage =
  "Sorry, I don’t know about that. Ask me about Mohammad’s family, academics, skills, projects, or contact.";

function tokens(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}
function score(userQ: string, item: QAPair) {
  let score = 0;
  const qT = new Set(tokens(userQ));
  const aT = new Set(tokens(item.q));
  for (const t of qT) if (aT.has(t)) score += 2;
  if (item.tags) for (const tag of item.tags) if (qT.has(tag)) score += 1;
  return score;
}
function askPortfolio(q: string) {
  const text = q.trim();
  if (!text) return fallbackMessage;

  let best: QAPair | null = null;
  let bestScore = 0;
  for (const item of knowledge) {
    const s = score(text, item);
    if (s > bestScore) {
      best = item;
      bestScore = s;
    }
  }
  return bestScore >= 3 ? best!.a : fallbackMessage;
}

/* ---------------------------
   COMPONENT
   --------------------------- */

export default function ChatMe() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introText = `💡 Here's a bit about me!

👨‍💻 Name: ${aboutMe.name}
🎯 Focus: ${aboutMe.focus.join(", ")}
💬 Passion: ${aboutMe.passion}

${aboutMe.bio}`;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = () => {
    const text = inputValue.trim();
    if (!text || loading) return;
    setInputValue("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    setTimeout(() => {
      const reply = askPortfolio(text);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 500);
  };

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

      {/* Intro Block */}
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
              className="bg-card border border-border rounded-3xl p-6 shadow-lg h-[58vh] overflow-y-auto"
            >
              {messages.length === 0 && (
                <p className="text-muted-foreground">
                  ✨ Ask me anything about Mohammad — family, college, marks, skills…
                </p>
              )}

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
                    onClick={send}
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
