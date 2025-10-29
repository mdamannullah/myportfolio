import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveDemo: string;
  github: string;
  index: number;
}

export const ProjectCard = ({ title, description, tech, image, liveDemo, github, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded-full">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <a
            href={liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:scale-105 transition-transform"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:scale-105 transition-transform"
          >
            <Github className="w-4 h-4" />
            Source
          </a>
        </div>
      </div>
    </motion.div>
  );
};
