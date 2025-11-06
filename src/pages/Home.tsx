import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Briefcase, Code, GraduationCap, BookOpen, Mail, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

const placeholders = [
  "I'm Mohammad's AI — ask me anything…",
  "Ask me about Mohammad's skills 🤖",
  "Curious about Mohammad's projects 🚀",
  "Learn about Mohammad's journey ✨",
  "Ask about Mohammad's education 🎓",
];

// add resume as a quick action
type QuickAction =
  | { label: string; icon: any; path: string; resume?: false }
  | { label: string; icon: any; resume: true };

const quickActions: QuickAction[] = [
  { label: "Me", icon: User, path: "/chat/me" },
  { label: "Projects", icon: Briefcase, path: "/chat/projects" },
  { label: "Skills", icon: Code, path: "/chat/skills" },
  { label: "Experience", icon: BookOpen, path: "/chat/experience" },
  { label: "Education", icon: GraduationCap, path: "/chat/education" },
  { label: "Contact", icon: Mail, path: "/chat/contact" },
  // resume tab
  { label: "Resume", icon: FileText, resume: true },
];

export default function Home() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate("/chat/me", { state: { query: inputValue } });
    }
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
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

          {/* Search Input */}
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
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Ask Mohammad.AI"
                title="Ask Mohammad.AI"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.form>

          {/* Quick Actions (now includes Resume) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isResume = "resume" in action && action.resume;

              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  onClick={() => {
                    if (isResume) {
                      // open resume in new tab
                      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
                    } else {
                      // @ts-ignore safe because non-resume has path
                      navigate(action.path);
                    }
                  }}
                  className={[
                    "flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105 shadow-sm",
                    "bg-card border border-border hover:bg-accent hover:border-accent",
                    isResume ? "ring-1 ring-primary/30" : ""
                  ].join(" ")}
                  aria-label={action.label}
                  title={isResume ? "View Resume" : action.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer (unchanged, includes "Made with ❤️ by Mohammad") */}
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
