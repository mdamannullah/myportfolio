import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/portfolioData";
import { ProjectCard } from "@/components/ProjectCard";
import { TypingEffect } from "@/components/TypingEffect";
import { useState } from "react";

type Category = "web" | "ai" | "ml" | "all" | null;

export default function ChatProjects() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>(null);
  const [showButtons, setShowButtons] = useState(true);

  const getCategoryEmoji = (cat: Category) => {
    switch (cat) {
      case "web": return "🌐";
      case "ai": return "🧠";
      case "ml": return "📊";
      default: return "🚀";
    }
  };

  const getCategoryTitle = (cat: Category) => {
    switch (cat) {
      case "web": return "Web Development Projects";
      case "ai": return "AI-Based Projects";
      case "ml": return "Machine Learning Projects";
      default: return "All Projects";
    }
  };

  const getFilteredProjects = () => {
    if (!activeCategory) return [];
    return projects[activeCategory] || [];
  };

  const getAllProjectsGrouped = () => {
    return [
      { category: "Web Development", projects: projects.web },
      { category: "AI-Based", projects: projects.ai },
      { category: "Machine Learning", projects: projects.ml },
    ];
  };

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory(cat);
    setShowButtons(false);
    setTimeout(() => setShowButtons(true), 2000);
  };

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
          <h1 className="text-lg font-semibold">Projects</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI Active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        {!activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-lg"
          >
            <p className="text-foreground mb-4">
              {/* <TypingEffect text="🚀 Let me show you my projects! Which category would you like to explore?" speed={15} /> */}
               <TypingEffect text="I am currently in my career growth stilll learning to build projects....." speed={15} />
            </p>
          </motion.div>
        )}

        {activeCategory && activeCategory !== "all" && (
          <>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">
                {getCategoryEmoji(activeCategory)} <TypingEffect text={`Here are my ${getCategoryTitle(activeCategory)}, neatly packed for you 👇`} speed={20} />
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredProjects().map((project, index) => (
                <ProjectCard key={project.id} {...project} index={index} />
              ))}
            </div>
          </>
        )}

        {activeCategory === "all" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">
                {/* 🌈 <TypingEffect text="Here are all my projects, organized by category 👇" speed={20} /> */}
                 <TypingEffect text="No Project to display" speed={20} /> 
              </h2>
            </motion.div>

            {getAllProjectsGrouped().map((group, groupIndex) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-foreground">
                  {getCategoryEmoji(groupIndex === 0 ? "web" : groupIndex === 1 ? "ai" : "ml")} {group.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.projects.map((project, index) => (
                    <ProjectCard key={project.id} {...project} index={index} />
                  ))}
                </div>
              </motion.div>
            ))}
          </>
        )}

        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {activeCategory !== "web" && (
              <button
                onClick={() => handleCategoryClick("web")}
                className="px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:scale-105 transition-all"
              >
                🌐 Show Web Projects
              </button>
            )}
            {activeCategory !== "ai" && (
              <button
                onClick={() => handleCategoryClick("ai")}
                className="px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:scale-105 transition-all"
              >
                🧠 Show AI Projects
              </button>
            )}
            {activeCategory !== "ml" && (
              <button
                onClick={() => handleCategoryClick("ml")}
                className="px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:scale-105 transition-all"
              >
                📊 Show ML Projects
              </button>
            )}
            {activeCategory !== "all" && (
              <button
                onClick={() => handleCategoryClick("all" as Category)}
                className="px-6 py-3 bg-card border border-border rounded-full hover:bg-accent hover:scale-105 transition-all"
              >
                🌈 Show All Projects
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
