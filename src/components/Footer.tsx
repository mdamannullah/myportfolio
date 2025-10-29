import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full py-6 text-center border-t border-border bg-background">
      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by Mohammad Amannullah
      </p>
    </footer>
  );
};
