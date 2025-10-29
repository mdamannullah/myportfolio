import { motion } from "framer-motion";
import { ArrowLeft, Code, Database, Brain, Wrench, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { skills } from "@/data/portfolioData";
import { TypingEffect } from "@/components/TypingEffect";

export default function ChatSkills() {
  const navigate = useNavigate();

  const skillCategories = [
    { title: "Programming Languages", items: skills.programming, icon: Code, color: "bg-blue-500" },
    { title: "Web Development", items: skills.webDev, icon: Code, color: "bg-green-500" },
    { title: "AI & Machine Learning", items: skills.aiMl, icon: Brain, color: "bg-purple-500" },
    { title: "Databases", items: skills.databases, icon: Database, color: "bg-orange-500" },
    { title: "Tools & Platforms", items: skills.tools, icon: Wrench, color: "bg-red-500" },
    { title: "Soft Skills", items: skills.soft, icon: Users, color: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Skills</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI Active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">
            <TypingEffect text="🛠️ Here's my tech stack and skills!" speed={20} />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 ${category.color} rounded-xl`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:scale-105 transition-transform"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
