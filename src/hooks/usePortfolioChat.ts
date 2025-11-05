import { useEffect, useRef, useState } from "react";
import { askPortfolio } from "@/lib/localQA";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function usePortfolioChat(initial: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { answer } = askPortfolio(text);
      setMessages(m => [...m, { role: "assistant", content: answer }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: "assistant", content: `⚠️ ${e.message || "Something went wrong"}` }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, send, scrollRef };
}
