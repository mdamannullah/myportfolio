import { motion } from "framer-motion";
import { ArrowLeft, Linkedin, Github, Twitter, Instagram, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { contact } from "@/data/portfolioData";
import { TypingEffect } from "@/components/TypingEffect";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  mail: Mail,
  phone: Phone,
};

const colorMap = {
  linkedin: "bg-blue-600",
  github: "bg-gray-800",
  twitter: "bg-sky-500",
  instagram: "bg-gradient-to-br from-purple-600 to-pink-500",
  mail: "bg-red-500",
  phone: "bg-green-600",
};

export default function ChatContact() {
  const navigate = useNavigate();

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
          <h1 className="text-lg font-semibold">Contact</h1>
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
            <TypingEffect text="📬 Let's connect! Here's how you can reach me:" speed={20} />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contact.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const bgColor = colorMap[item.icon as keyof typeof colorMap];
            
            return (
              <motion.a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 group"
              >
                <div className={`p-4 ${bgColor} rounded-xl flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.platform}</h3>
                  <p className="text-sm text-muted-foreground">{item.handle}</p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-3xl p-6 shadow-lg"
        >
          <p className="text-muted-foreground">
            ✨ Feel free to reach out for collaborations, opportunities, or just a friendly chat!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
