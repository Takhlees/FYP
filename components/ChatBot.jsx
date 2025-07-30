"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Paperclip } from "lucide-react";
import { PulseLoader } from "react-spinners";

export default function ChatBot({ onClose }) {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  // Prevent background scroll on mobile when ChatBot is open
  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/chatbot");
        const data = await res.json();
        if (data?.chats) {
          setChat(data.chats);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
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

    setChat((prev) => [
      ...prev,
      {
        from: "bot",
        isTyping: true,
      },
    ]);

    setMessage("");
    setImage(null);

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
        setChat((prev) => {
          const updated = prev.filter((msg) => !msg.isTyping);
          return [
            ...updated,
            {
              from: "model",
              text: data.response || data.answer || "No reply received.",
            },
          ];
        });
      } else {
        setChat((prev) => {
          const updated = prev.filter((msg) => !msg.isTyping);
          return [...updated, { from: "bot", text: "Something went wrong!" }];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => {
        const updated = prev.filter((msg) => !msg.isTyping);
        return [...updated, { from: "bot", text: "Something went wrong!" }];
      });
    }
  };

  return (
    <>
      {/* Overlay for mobile modal effect */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-30 sm:hidden" />
      <div className="fixed bottom-0 right-0 left-0 sm:bottom-0 sm:right-4 sm:left-auto sm:w-[400px] h-[100dvh] sm:h-[70vh] bg-white shadow-xl z-50 rounded-t-lg flex flex-col max-w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-black via-mid to-light bg-clip-text text-transparent">
              Doculus AI
            </h2>
            <p className="text-sm opacity-90">Your intelligent assistant</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
            aria-label="Close chatbot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 mb-5 flex overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <PulseLoader size={15} />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 space-y-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      msg.from === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.from === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                          : "bg-gray-200 text-gray-800 rounded-bl-sm shadow-md border-gray-200"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded"
                          className="mb-2 max-w-full rounded"
                        />
                      )}
                      {msg.isTyping ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      ) : (
                        <div
                          className={`text-sm ${
                            msg.from === "user" ? "text-white" : "text-gray-800"
                          }`}
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                      )}
                    </div>
                  </div>
                  <div ref={bottomRef} />
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 space-y-4 border-t bg-white">
          {/* Image Preview */}
          {image && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2 bg-gray-100 px-3 py-1 w-fit">
              <span className="flex items-center gap-1">
                📎 <span className="font-medium">{image.name}</span>
              </span>
              <button
                onClick={() => setImage(null)}
                type="button"
                className="ml-3 text-gray-400 hover:text-red-500 font-bold text-lg"
                title="Remove attachment"
              >
                ×
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />

          <div className="flex items-end space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || (!message.trim() && !image)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
