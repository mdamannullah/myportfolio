import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-muted transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div
        className={`transition-all duration-300 ${
          isRotating ? "rotate-180 scale-110" : "rotate-0 scale-100"
        }`}
      >
        {theme === "light" ? (
          <Sun className="w-6 h-6 text-foreground" />
        ) : (
          <Moon className="w-6 h-6 text-yellow-400" />
        )}
      </div>
    </button>
  );
};
