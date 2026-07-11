"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { profile } from "@/lib/data";
import { handleSpotlight } from "@/lib/spotlight";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "What's your career journey so far?",
  "What projects have you built?",
  "What's your tech stack?",
];

export default function AICareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hey, I'm ${profile.name}'s digital twin. Ask me anything about my career, skills, or projects.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handleSpotlight}
      className="spotlight-card overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface-2 text-accent">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Ask my digital twin</p>
          <p className="text-xs text-muted">Powered by Google Gemini</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex h-80 flex-col gap-3 overflow-y-auto px-5 py-5"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "self-end bg-accent text-background"
                : "self-start bg-surface-2 text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 self-start rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-muted">
            <Loader2 size={14} className="animate-spin" />
            Thinking...
          </div>
        )}
        {error && (
          <p role="alert" className="text-xs text-accent-3">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-line px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my career..."
          aria-label="Ask about my career"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent text-background transition-opacity disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
