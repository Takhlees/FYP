"use client";

import { useState, useEffect } from "react";

export default function ChatBot({ onClose }) {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  

useEffect(() => {
  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chatbot");
      const data = await res.json();
      if (data?.chats) {
        setChat(data.chats);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  fetchChatHistory();
}, []);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    setChat((prev) => [
      ...prev,
      {
        from: "user",
        text: message,
        image: image ? URL.createObjectURL(image) : null,
      },
    ]);
    setLoading(true);

    const formData = new FormData();
    formData.append("text", message);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data?.response) {
        setChat((prev) => [
          ...prev,
          {
            from: "model",
            text: data.response || data.answer || "No reply received.",
          },
        ]);
       
      } else {
        console.error("Empty response from backend:", data);
        setChat((prev) => [
          ...prev,
          { from: "model", text: "Sorry, I couldn't get an answer." },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => [
        ...prev,
        { from: "model", text: "Something went wrong!" },
      ]);
    } finally {
      setMessage("");
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10 bg-white">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
          title="Close">
          ×
        </button>
      )}

      <h2 className="text-xl font-semibold mb-4 text-center">
        📚 DocuLess ChatBot
      </h2>

      <div className="h-80 overflow-y-auto space-y-3 border p-3 rounded-lg bg-gray-50 mb-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm ${
              msg.from === "user" ? "text-right" : "text-left"
            }`}>
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                className="inline-block max-w-xs mb-1 rounded"
              />
            )}
            
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-200 text-gray-900"
              }`}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm italic">Typing...</p>}
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="file:mr-3 file:border-none file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something or explain with an image..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
