"use client";
import { useState } from "react";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setChat((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();
    setChat((prev) => [...prev, { from: "bot", text: data.answer }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl w-[350px] max-h-[500px] flex flex-col z-50 border">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold">
        Ask AdminBot
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chat.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.from === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-100 text-black"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-sm text-gray-400">Bot is typing...</div>
        )}
      </div>

      <div className="flex p-2 border-t gap-2">
        <input
          type="text"
          className="flex-grow border rounded px-2 py-1 text-sm focus:outline-none"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
