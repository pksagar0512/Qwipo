import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function QwiChat({ token }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Welcome to Qwipo Assistance! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/qwichat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      if (Array.isArray(data.products) && data.products.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Here’s what I found for you:",
            products: data.products,
          },
        ]);
      } else if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Sorry, I couldn't find anything relevant 😅" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Network error, please try again later." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
            <h2 className="font-semibold text-white">QwiChat – Your AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-red-400 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.products && m.products.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {m.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 p-2 rounded-lg hover:scale-105 transition cursor-pointer"
                        >
                          <img
                            src={p.image || "/default-logo.png"}
                            alt={p.name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <p className="text-sm font-semibold mt-1 truncate">{p.name}</p>
                          <p className="text-xs text-emerald-400">₹{p.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-700 p-3 flex items-center">
            <input
              type="text"
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
