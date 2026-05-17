// ─── src/components/ChatBot.jsx ──────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, ChevronDown } from "lucide-react";
import LightProfile from "@/assets/bg-light.png";
import DarkProfile  from "@/assets/bg-black.png";

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
1. UNEP — awareness video
2. Mr and Ms Nursing 2025 Trailer
3. Unicharm Logo Animation
4. Car Montage — client work
5. NOVUS Logo Animation
6. Wooden Horse Steakhouse — promo video
7. Mobile Legends & Call of Duty Teaser
8. Sining Malaya — arts festival promo
9. Pre-debut 18th Birthday — client video

CONTACT: quitalegmj24@gmail.com

Keep answers short, warm, and conversational. If someone wants to hire Mark, encourage them to use the Contact button or email him. Never make up information not listed above.`;

const ChatBot = ({ darkMode }) => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages,  setMessages]  = useState([
    { role: "assistant", content: "Hey! 👋 I'm Mark's AI assistant. Ask me anything about his work or how to get in touch!" },
  ]);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setIsLoading(true);
    try {
      const res  = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", max_tokens: 1000, temperature: 0.7,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history.map(m => ({ role: m.role, content: m.content }))],
        }),
      });
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, something went wrong.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error — please try again." }]);
    } finally { setIsLoading(false); }
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const avatar = darkMode ? DarkProfile : LightProfile;

  const g = darkMode ? {
    panel:      "bg-[rgba(18,18,24,0.75)] border border-white/10 backdrop-blur-[40px]",
    shadow:     "shadow-[0_40px_100px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.07)]",
    header:     "bg-white/[0.04] border-b border-white/[0.07]",
    body:       "",
    aiBubble:   "bg-white/[0.09] border border-white/[0.08] text-white/90",
    userBubble: "bg-[rgba(56,100,255,0.55)] border border-blue-400/20 text-white",
    inputBar:   "bg-white/[0.04] border-t border-white/[0.07]",
    inputField: "bg-white/[0.08] border border-white/[0.1] text-white placeholder-white/25 focus:border-white/25 focus:bg-white/[0.12]",
    sendBtn:    "bg-white/[0.12] hover:bg-white/[0.2] text-white disabled:opacity-25",
    nameColor:  "text-white",
    subColor:   "text-white/35",
    brand:      "text-white/15",
    closeBtn:   "text-white/30 hover:text-white/70 hover:bg-white/[0.08]",
    dotBorder:  "ring-[#12121a]",
    fab:        "bg-[rgba(18,18,24,0.8)] border border-white/12 backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
    scrollThumb:"rgba(255,255,255,0.12)",
    typingDot:  "bg-white/40",
  } : {
    panel:      "bg-[rgba(255,255,255,0.72)] border border-black/[0.06] backdrop-blur-[40px]",
    shadow:     "shadow-[0_40px_100px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]",
    header:     "bg-white/50 border-b border-black/[0.05]",
    body:       "",
    aiBubble:   "bg-white/80 border border-black/[0.06] text-gray-800",
    userBubble: "bg-blue-500 border border-blue-400/20 text-white",
    inputBar:   "bg-white/40 border-t border-black/[0.05]",
    inputField: "bg-white/70 border border-black/[0.07] text-gray-800 placeholder-gray-400/60 focus:border-blue-400/40 focus:bg-white/90",
    sendBtn:    "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-30",
    nameColor:  "text-gray-900",
    subColor:   "text-gray-400",
    brand:      "text-gray-300",
    closeBtn:   "text-gray-400 hover:text-gray-600 hover:bg-black/[0.04]",
    dotBorder:  "ring-white",
    fab:        "bg-white/75 border border-white backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
    scrollThumb:"rgba(0,0,0,0.10)",
    typingDot:  "bg-gray-400/60",
  };

  return (
    <>
      <style>{`
        .iphonechat-scroll::-webkit-scrollbar { width: 3px; }
        .iphonechat-scroll::-webkit-scrollbar-track { background: transparent; }
        .iphonechat-scroll::-webkit-scrollbar-thumb {
          background: ${g.scrollThumb};
          border-radius: 99px;
        }
        .iphonechat-scroll { scrollbar-width: thin; scrollbar-color: ${g.scrollThumb} transparent; }
      `}</style>

      {/* ── Panel ────────────────────────────────────────────────────────────── */}
      <div
        className={`
          fixed right-4 sm:right-6 z-50
          w-[calc(100vw-2rem)] sm:w-[340px]
          rounded-[30px] overflow-hidden
          ${g.panel} ${g.shadow}
          transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-[0.93] pointer-events-none"}
        `}
        style={{ bottom: "80px", maxHeight: "min(560px, calc(100vh - 100px))", display: "flex", flexDirection: "column" }}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3.5 ${g.header}`}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src={avatar} alt="Mark" className={`w-9 h-9 rounded-full object-cover ring-2 ring-white/20`} />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ${g.dotBorder}`} />
            </div>
            <div>
              <p className={`text-[13px] font-semibold leading-tight tracking-[-0.01em] ${g.nameColor}`}>
                Mark's Assistant
              </p>
              <p className={`text-[10px] mt-0.5 ${g.subColor}`}>AI · Always online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${g.closeBtn}`}
            aria-label="Close"
          >
            <ChevronDown size={15} />
          </button>
        </div>

        {/* Messages */}
        <div
          className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 iphonechat-scroll ${g.body}`}
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {msg.role === "assistant" && (
                <img src={avatar} alt="Mark" className="w-[22px] h-[22px] rounded-full object-cover flex-shrink-0 mb-0.5 ring-1 ring-white/15" />
              )}

              <div
                className={`
                  max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed tracking-[-0.01em]
                  backdrop-blur-sm
                  ${msg.role === "user"
                    ? `${g.userBubble} rounded-[18px] rounded-br-[5px]`
                    : `${g.aiBubble} rounded-[18px] rounded-bl-[5px]`
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <img src={avatar} alt="Mark" className="w-[22px] h-[22px] rounded-full object-cover flex-shrink-0 ring-1 ring-white/15" />
              <div className={`px-4 py-3 rounded-[18px] rounded-bl-[5px] backdrop-blur-sm ${g.aiBubble}`}>
                <div className="flex items-center gap-1.5">
                  {[0, 160, 320].map(delay => (
                    <span key={delay} className={`w-1.5 h-1.5 rounded-full animate-bounce ${g.typingDot}`}
                      style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-3 pb-5 pt-3 ${g.inputBar}`}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Message…"
              disabled={isLoading}
              className={`
                flex-1 px-4 py-2.5 rounded-full text-[13px] outline-none
                transition-all duration-200 backdrop-blur-sm
                ${g.inputField}
              `}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${g.sendBtn}`}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
          <p className={`text-[9px] text-center mt-3 tracking-[0.2em] uppercase font-medium ${g.brand}`}>
            Mark AI
          </p>
        </div>
      </div>

      {/* ── FAB ──────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Toggle chat"
        className={`
          fixed bottom-6 right-4 sm:right-6 z-50
          w-[52px] h-[52px] rounded-full overflow-hidden
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          ${g.fab}
        `}
      >
        {isOpen ? (
          <div className={`w-full h-full flex items-center justify-center ${darkMode ? "bg-white/10" : "bg-black/5"}`}>
            <X size={20} className={darkMode ? "text-white/80" : "text-gray-600"} />
          </div>
        ) : (
          <>
            <img src={avatar} alt="Chat with Mark's AI" className="w-full h-full object-cover" />

          </>
        )}
      </button>
    </>
  );
};

export default ChatBot;
