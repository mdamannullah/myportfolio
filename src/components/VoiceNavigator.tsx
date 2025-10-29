import { Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VoiceNavigator = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    if (command.includes("project")) {
      navigate("/chat/projects");
      toast.success("Opening Projects");
    } else if (command.includes("skill")) {
      navigate("/chat/skills");
      toast.success("Opening Skills");
    } else if (command.includes("experience")) {
      navigate("/chat/experience");
      toast.success("Opening Experience");
    } else if (command.includes("education") || command.includes("qualification")) {
      navigate("/chat/education");
      toast.success("Opening Education");
    } else if (command.includes("contact")) {
      navigate("/chat/contact");
      toast.success("Opening Contact");
    } else if (command.includes("home")) {
      navigate("/");
      toast.success("Going Home");
    } else if (command.includes("about") || command.includes("me")) {
      navigate("/chat/me");
      toast.success("Opening About Me");
    }
  };

  const toggleVoiceNavigation = async () => {
    if (!recognition) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (!isListening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        setIsListening(true);
        toast.success("Voice navigation activated! Try saying 'show projects' or 'show skills'");
      } catch (error) {
        toast.error("Microphone permission denied");
      }
    } else {
      recognition.stop();
      setIsListening(false);
      toast.info("Voice navigation deactivated");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleVoiceNavigation}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 animate-float ${
              isListening
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-card text-card-foreground hover:scale-105"
            }`}
            aria-label="Voice navigation"
          >
            {isListening ? (
              <Mic className="w-6 h-6 animate-pulse" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Voice Navigation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
