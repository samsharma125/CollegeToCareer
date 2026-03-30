"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply || data.error || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-neutral-950 to-black text-white">

      {/* 🔥 HEADER */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          🤖 AI Assistant
        </h1>

        <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
          Teacher AI
        </span>
      </div>

      {/* 💬 CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">
            Ask anything about assignments, students, or concepts 📚
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm backdrop-blur-xl border ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent shadow-lg"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-xs animate-pulse">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* ✨ INPUT BAR */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">

          {/* INPUT */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            placeholder="Ask something..."
          />

          {/* 🎤 MIC */}
          <button
            onClick={startListening}
            className={`p-2 rounded-xl transition ${
              listening
                ? "bg-red-500 animate-pulse"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            🎤
          </button>

          {/* SEND */}
          <button
            onClick={sendMessage}
            className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg"
          >
            ➤
          </button>

        </div>
      </div>
    </div>
  );
}