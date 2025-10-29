import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aboutMe } from "@/data/portfolioData";
import { Footer } from "@/components/Footer";
import { TypingEffect } from "@/components/TypingEffect";
import { useState } from "react";

export default function ChatMe() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const introText = `💡 Here's a bit about me!\n\n👨‍💻 Name: ${aboutMe.name}\n🎯 Focus: ${aboutMe.focus.join(", ")}\n💬 Passion: ${aboutMe.passion}\n\n${aboutMe.bio}`;

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

      {/* Chat Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 shadow-lg"
        >
          <div className="whitespace-pre-line text-foreground">
            <TypingEffect text={introText} speed={15} onComplete={() => setShowContent(true)} />
          </div>
        </motion.div>

        {showContent && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-lg"
            >
              <p className="text-muted-foreground">
                ✨ Would you like to explore my Skills or Experience next?
              </p>
            </motion.div>

            {/* Chat Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky bottom-4"
            >
              <div className="bg-card/80 backdrop-blur-lg border border-border rounded-3xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        console.log("Sending message:", inputValue);
                        setInputValue("");
                      }
                    }}
                    placeholder="Continue chatting with Mohammed.AI..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button 
                    onClick={() => {
                      console.log("Sending message:", inputValue);
                      setInputValue("");
                    }}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
