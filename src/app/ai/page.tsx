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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">

      {/* Header */}
      <div className="p-3 text-center text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md">
        🤖 AI Assistant
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            Ask anything 📚
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-xs animate-pulse">
            AI typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input (Sticky Bottom) */}
      <div className="sticky bottom-0 p-2 bg-black/80 backdrop-blur border-t border-gray-800">

        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-3 py-2">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            placeholder="Ask... "
          />

          {/* 🎤 Mic */}
          <button
            onClick={startListening}
            className={`p-2 rounded-full ${
              listening
                ? "bg-red-500 animate-pulse"
                : "bg-gray-700"
            }`}
          >
            🎤
          </button>

          {/* Send */}
          <button
            onClick={sendMessage}
            className="p-2 bg-indigo-600 rounded-full"
          >
            ➤
          </button>

        </div>
      </div>
    </div>
  );
}