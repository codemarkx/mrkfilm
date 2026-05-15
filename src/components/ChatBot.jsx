import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

// ─── Portfolio context fed to the AI ─────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Mark Quitaleg's personal portfolio website. Your job is to help visitors learn about Mark and his work.

Here is everything you know about Mark:

PERSONAL INFO:
- Full name: Mark Quitaleg
- Location: Dasmariñas, Cavite, Philippines
- Age: 22 years old, Filipino
- Role: Video Editor & Graphics Designer

EDUCATION:
- Kolehiyo ng Lungsod ng Dasmariñas — BS Information Systems (2022–Present), Dean's Lister
- Dasmarinas Integrated High School — HUMSS strand (2016–2022), Graduated with honors

EXPERIENCE:
- Freelance Video Editor (WFH, 2023–Present)
- Head of Video Editing Team (Organization, 2023–2024)
- Vice President of Multimedia Org (2024–2025)

SKILLS:
- Film Editing (Premiere Pro, Capcut, Color Grading)
- Commercial & Advertising videos
- Social Media & Short-Form content
- Trailer & Promo Videos
- Graphics Design (Photoshop, Canva, Illustrator)

TOOLS: Premiere Pro, After Effects, Capcut, Freepik, Canva, Adobe Illustrator, Figma, Adobe Lightroom, Photoshop, ChatGPT, Pixabay, Pexels, KineMaster

PROJECTS:
1. UNEP (United Nations Environment Programme) — awareness video using Premiere Pro, Capcut, After Effects
2. Mr and Ms Nursing 2025 Trailer — school event trailer using After Effects & Premiere Pro
3. Unicharm Logo Animation — school project using After Effects & Canva
4. Car Montage — client work using After Effects & Canva
5. NOVUS Logo Animation — organization logo using After Effects & Canva
6. Wooden Horse Steakhouse — promo video for local restaurant
7. Mobile Legends & Call of Duty Teaser — esports event teaser
8. Sining Malaya — school arts festival promo video
9. Pre-debut 18th Birthday — client milestone video

CONTACT: quitalegmj24@gmail.com

Keep answers short, warm, and conversational. If someone wants to hire Mark or collaborate, encourage them to use the Contact button or email him. Never make up information not listed above.`;

// ─── ChatBot Component ────────────────────────────────────────────────────────
const ChatBot = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! 👋 I'm Mark's AI assistant. Ask me anything about his work, skills, or how to get in touch!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Format messages for Groq API (OpenAI-compatible format)
      const groqMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages.map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        }))
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          max_tokens: 1000,
          temperature: 0.7,
        })
      });

      const data = await response.json();

      // Extract the reply from Groq's response
      let reply = "Sorry, I couldn't get a response. Try again!";
      if (data.choices && data.choices[0]?.message?.content) {
        reply = data.choices[0].message.content;
      } else if (data.error) {
        console.error("Groq API error:", data.error);
        reply = `API Error: ${data.error.message || "Something went wrong"}`;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Theme-aware styles (mirrors your existing `t` tokens) ──
  const panel = darkMode
    ? "bg-[#111118] border border-[#1e1e2e] shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
    : "bg-white border border-gray-200 shadow-2xl";

  const header = darkMode
    ? "bg-[#0d0d14] border-b border-[#1e1e2e]"
    : "bg-gradient-to-r from-blue-600 to-blue-500";

  const msgArea = darkMode ? "bg-[#0a0a0f]" : "bg-gray-50";

  const aiBubble = darkMode
    ? "bg-[#1a1a28] text-[#c0c8e0] border border-[#1e1e2e]"
    : "bg-white text-gray-700 border border-gray-200 shadow-sm";

  const userBubble = darkMode
    ? "bg-[#1a2040] text-[#8aa0ff]"
    : "bg-blue-600 text-white";

  const inputArea = darkMode
    ? "bg-[#0d0d14] border-t border-[#1e1e2e]"
    : "bg-white border-t border-gray-200";

  const inputField = darkMode
    ? "bg-[#1a1a28] border border-[#1e1e2e] text-white placeholder-[#5a6278] focus:border-[#6c8cff]"
    : "bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400";

  const sendBtn = darkMode
    ? "bg-[#1a2040] hover:bg-[#232b52] text-[#8aa0ff] disabled:opacity-40"
    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40";

  const fab = darkMode
    ? "bg-[#1a2040] hover:bg-[#232b52] text-[#8aa0ff] shadow-[0_4px_20px_rgba(108,140,255,0.3)] border border-[#2a3060]"
    : "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)]";

  return (
    <>
      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[360px] rounded-2xl overflow-hidden transition-all duration-300 ${panel} ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "520px", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 ${header}`}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-transparent" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">Mark's Assistant</p>
              <p className="text-white/60 text-[10px] mt-0.5">AI-powered · Always online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div
          className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${msgArea}`}
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === "user"
                    ? darkMode ? "bg-[#1a2040]" : "bg-blue-100"
                    : darkMode ? "bg-[#1a1a28]" : "bg-gray-100"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={12} className={darkMode ? "text-[#8aa0ff]" : "text-blue-600"} />
                ) : (
                  <Bot size={12} className={darkMode ? "text-[#8891a8]" : "text-gray-500"} />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? `${userBubble} rounded-br-sm`
                    : `${aiBubble} rounded-bl-sm`
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${darkMode ? "bg-[#1a1a28]" : "bg-gray-100"}`}>
                <Bot size={12} className={darkMode ? "text-[#8891a8]" : "text-gray-500"} />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${aiBubble}`}>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`px-3 py-3 ${inputArea}`}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Mark's work..."
              disabled={isLoading}
              className={`flex-1 px-3.5 py-2 rounded-xl text-sm outline-none transition-colors ${inputField}`}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${sendBtn}`}
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
          <p className={`text-[10px] text-center mt-2 ${darkMode ? "text-[#3a3a5c]" : "text-gray-300"}`}>
            Powered by Groq AI
          </p>
        </div>
      </div>

      {/* ── FAB Button ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${fab}`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X size={22} className="transition-transform duration-200" />
        ) : (
          <MessageCircle size={22} className="transition-transform duration-200" />
        )}

        {/* Pulse ring (only when closed) */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
        )}
      </button>
    </>
  );
};

export default ChatBot;
