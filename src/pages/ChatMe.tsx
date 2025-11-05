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
  { q: "What is your full name?", a: "My name is Mohammad Amannullah.", tags: ["about"] },
  { q: "Where are you from?", a: "Madhubani, Darbhanga, Bihar (India); currently in Salem, Tamil Nadu.", tags: ["about"] },
  { q: "Languages you speak?", a: "English, Hindi, Urdu, Arabic; currently learning Tamil.", tags: ["about"] },
  { q: "Tell me about your family.", a: "We’re a humble vendor family; my parents work hard and support my studies.", tags: ["family"] },

  // Education as lines (timeline look)
  {
    q: "Your current college and program?",
    a: `B.E. CSE (AI & ML) — AVS Engineering College, Salem · 2025 batch
JAC Class 12 (Science) — 273/500 (2nd Division)`,
    tags: ["education"]
  },
  { q: "Your 12th board details?", a: "JAC Class 12 (Science): 273/500 (2nd Division).", tags: ["education"] },

  // Skills (comma/semicolon separated → pills with logos)
  {
    q: "Your core skills?",
    a: "HTML5, CSS3, JavaScript, TypeScript, React, Tailwind CSS, Python, NumPy, PyTorch, C, C++, Java, MySQL, Git, GitHub",
    tags: ["skills"]
  },

  // Projects (each per line; optional [tech: ...] and (link: ...))
  {
    q: "Top project?",
    a: `AI Portfolio Chat — portfolio with strict Q&A about me [tech: React, Vite, TypeScript, Tailwind CSS] (link: https://mdamannullah.github.io/myportfolio/)
Landing Page Clone — pixel-perfect UI practice [tech: HTML5, CSS3, JavaScript] (link: https://github.com/mdamannullah)`,
    tags: ["projects"]
  },

  // Contact
  { q: "How can I contact you?", a: "Email: info.mohmdam@gmail.com • GitHub: github.com/mdamannullah • LinkedIn: https://linkedin.com/in/mdamannullah", tags: ["contact"] },

  { q: "Future plan?", a: "Become an AI/ML engineer; build web+AI projects and compete in hackathons.", tags: ["about"] },
];

const fallbackMessage =
  "Sorry, I don’t know about that. Ask me about Mohammad’s family, academics, skills, projects, or contact.";

/* ---------------------------
   SEARCH / MATCH
   --------------------------- */
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
   EMOJI + FORMAT HELPERS
   --------------------------- */
function categoryEmoji(cat?: string) {
  switch ((cat || "").toLowerCase()) {
    case "skills": return "🧠";
    case "education": return "🎓";
    case "projects": return "🚀";
    case "contact": return "✉️";
    case "family": return "👨‍👩‍👦";
    case "about": return "👋";
    default: return "💡";
  }
}
function sprinkleEmojis(text: string) {
  return text
    .replace(/\bhtml\b/gi, "HTML 🧩")
    .replace(/\bcss\b/gi, "CSS 🎨")
    .replace(/\bjavascript\b/gi, "JavaScript ⚡")
    .replace(/\breact\b/gi, "React ⚛️")
    .replace(/\btypescript\b/gi, "TypeScript 🔷")
    .replace(/\btailwind\b/gi, "Tailwind 🌬️")
    .replace(/\bpython\b/gi, "Python 🐍")
    .replace(/\bnumpy\b/gi, "NumPy 🔢")
    .replace(/\bpytorch\b/gi, "PyTorch 🔥")
    .replace(/\bmysql\b/gi, "MySQL 🐬")
    .replace(/\bjava\b/gi, "Java ☕")
    .replace(/\bc\+\+\b/gi, "C++ 🧩")
    .replace(/\bc\b/gi, "C 🧩")
    .replace(/\bai\b/gi, "AI 🤖");
}

/* devicon class map (name variations → devicon class) */
function techToDeviconClass(raw: string) {
  const t = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    "html": "devicon-html5-plain",
    "html5": "devicon-html5-plain",
    "css": "devicon-css3-plain",
    "css3": "devicon-css3-plain",
    "javascript": "devicon-javascript-plain",
    "js": "devicon-javascript-plain",
    "typescript": "devicon-typescript-plain",
    "react": "devicon-react-original",
    "tailwind": "devicon-tailwindcss-plain",
    "tailwind css": "devicon-tailwindcss-plain",
    "python": "devicon-python-plain",
    "numpy": "devicon-numpy-original",
    "pytorch": "devicon-pytorch-original",
    "c": "devicon-c-plain",
    "c++": "devicon-cplusplus-plain",
    "java": "devicon-java-plain",
    "mysql": "devicon-mysql-plain",
    "git": "devicon-git-plain",
    "github": "devicon-github-original",
    "vite": "devicon-vitejs-plain",
    "vercel": "devicon-vercel-original",
  };
  return map[t] || "";
}

/* parse "Title — desc [tech: a,b] (link: url)" → objects */
function parseProjects(block: string) {
  return block.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const techMatch = line.match(/\[tech:\s*([^\]]+)\]/i);
    const linkMatch = line.match(/\(link:\s*([^)]+)\)/i);
    const clean = line.replace(/\[tech:[^\]]+\]/i, "").replace(/\(link:[^)]+\)/i, "").trim();
    return {
      title: clean.split(" — ")[0]?.trim() || clean,
      desc: clean.split(" — ")[1]?.trim() || "",
      tech: techMatch ? techMatch[1].split(/[,|]/).map(s => s.trim()).filter(Boolean) : [],
      link: linkMatch ? linkMatch[1].trim() : ""
    };
  });
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
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introText = `💡 Here's a bit about me!

👨‍💻 Name: ${aboutMe.name}
🎯 Focus: ${aboutMe.focus.join(", ")}
💬 Passion: ${aboutMe.passion}

${aboutMe.bio}`;

  // auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, typingIndex]);

  // type a message into messages[idx]
  function typeIntoMessage(idx: number, full: string, speed = 16) {
    setTypingIndex(idx);
    const txt = sprinkleEmojis(full);
    let i = 0;
    const step = () => {
      i += 1;
      setMessages(prev => {
        const arr = [...prev];
        const current = arr[idx];
        if (!current) return prev;
        arr[idx] = { ...current, content: txt.slice(0, i) };
        return arr;
      });
      if (i < txt.length) {
        window.setTimeout(step, speed);
      } else {
        setTypingIndex(null);
      }
    };
    step();
  }

  // send helper
  const send = (forced?: string) => {
    const text = (forced ?? inputValue).trim();
    if (!text || loading) return;
    setInputValue("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    setTimeout(() => {
      const { answer, category } = askPortfolio(text);
      setMessages((m) => [...m, { role: "assistant", content: "", category }]);
      setLoading(false);
      const idx = messages.length + 1;
      typeIntoMessage(idx, `${answer}`, 14);
    }, 250);
  };

  // auto-send from Home
  useEffect(() => {
    const q = location.state?.query;
    if (q) {
      setShowContent(true);
      setTimeout(() => send(q), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- UI helpers ----------------
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

  // tech pill with logo (Devicon)
  function TechPill({ name }: { name: string }) {
    const cls = techToDeviconClass(name);
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 text-sm">
        {cls ? <i className={`${cls} colored text-base`} /> : <span>🔹</span>}
        <span>{name}</span>
      </span>
    );
  }

  function renderAssistant(msg: Msg, i: number) {
    const emoji = categoryEmoji(msg.category);
    const text = msg.content;

    if (msg.category === "skills") {
      const skills = text.split(/[;,•|]/).map(s => s.trim()).filter(Boolean);
      return (
        <SectionCard key={i} title="Skills" emoji={emoji}>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => <TechPill key={idx} name={s} />)}
          </div>
        </SectionCard>
      );
    }

    if (msg.category === "education") {
      const lines = text.split("\n").filter(Boolean);
      return (
        <SectionCard key={i} title="Education" emoji={emoji}>
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            <ul className="space-y-3">
              {(lines.length ? lines : [text]).map((l, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute -left-[9px] mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="ml-2">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      );
    }

    if (msg.category === "projects") {
      const items = parseProjects(text);
      return (
        <SectionCard key={i} title="Projects" emoji={emoji}>
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((p, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-white/60 dark:bg-zinc-900/50 p-3">
                <div className="font-semibold flex items-center gap-2">
                  <span>🚀</span>
                  <span>{p.title}</span>
                </div>
                {p.desc && <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>}
                {p.tech.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tech.map((t, i2) => <TechPill key={i2} name={t} />)}
                  </div>
                )}
                {p.link && (
                  <a className="mt-2 inline-block text-sm underline" href={p.link} target="_blank" rel="noreferrer">
                    Visit ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      );
    }

    if (msg.category === "contact") {
      const withLinks = text.replace(
        /(https?:\/\/[^\s]+|github\.com\/[^\s]+)/gi,
        (m) => `<a class="underline" href="${m.startsWith('http') ? m : 'https://' + m}" target="_blank" rel="noreferrer">${m}</a>`
      );
      return (
        <SectionCard key={i} title="Contact" emoji={emoji}>
          <p dangerouslySetInnerHTML={{ __html: withLinks }} />
        </SectionCard>
      );
    }

    if (text === fallbackMessage) {
      return (
        <SectionCard key={i} title="I don’t know this one" emoji="🤝">
          <p>{fallbackMessage}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>About</Pill><Pill>Family</Pill><Pill>Education</Pill>
            <Pill>Skills</Pill><Pill>Projects</Pill><Pill>Contact</Pill>
          </div>
        </SectionCard>
      );
    }

    // default bubble
    return (
      <div key={i} className="text-left">
        <div className="inline-block px-3 py-2 rounded-2xl bg-gray-200 dark:bg-zinc-800">
          {text}
        </div>
      </div>
    );
  }

  // small when empty; grows only when messages appear
  const isEmpty = messages.length === 0 && !loading && typingIndex === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-muted rounded-full transition-colors">
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
                isEmpty ? "min-h-[120px] max-h-[48vh]" : "max-h-[60vh]"
              ].join(" ")}
            >
              {isEmpty && (
                <p className="text-muted-foreground">
                  ✨ Ask me anything about Mohammad — family, college, marks, skills…
                </p>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="mb-3 text-right">
                    <div className="inline-block px-3 py-2 rounded-2xl bg-indigo-600 text-white">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="mb-3">
                    {renderAssistant(m, i)}
                  </div>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-4">
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
