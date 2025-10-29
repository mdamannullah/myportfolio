import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { experience } from "@/data/portfolioData";
import { TypingEffect } from "@/components/TypingEffect";
import { useState } from "react";

export default function ChatExperience() {
  const navigate = useNavigate();
  const [showCards, setShowCards] = useState(false);

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
          <h1 className="text-lg font-semibold">Experience</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI Active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold">
            {/* <TypingEffect text="💼 Here's my professional journey!" speed={20} onComplete={() => setShowCards(true)} /> */}
             <TypingEffect text="⚠️ As I am fresher I am still looking for opportunities to grow and learn in the field." speed={20} onComplete={() => setShowCards(true)} />
          </h2>
        </motion.div>

        {showCards && experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary rounded-xl flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-primary font-semibold">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.period}</p>
                </div>
                <p className="text-muted-foreground">{exp.description}</p>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Key Achievements:</p>
                  {exp.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
