// ─── src/components/ChatBot.jsx ──────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageSquare, ChevronDown } from "lucide-react";
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
    { role: "assistant", content: "Hey! I'm Mark's assistant. Ask me anything about his work or how to get in touch." },
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

  // ── tokens mirroring mk() from Profile.jsx ──────────────────────────────
  const g = darkMode ? {
    panel:       "bg-[#0a0a0a] border border-[#191919]",
    header:      "border-b border-[#111111]",
    aiBubble:    "bg-[#0d0d0d] border border-[#111111] text-[#c0c0c0]",
    userBubble:  "bg-[#408A71] text-[#000000]",
    inputBar:    "border-t border-[#111111]",
    inputField:  "bg-[#0d0d0d] border border-[#1a1a1a] text-[#c0c0c0] placeholder-[#333333] focus:border-[#2a2a2a]",
    sendBtn:     "bg-[#408A71] hover:bg-[#357a62] text-[#000000] disabled:opacity-30 disabled:cursor-not-allowed",
    nameColor:   "text-[#e8e8e8]",
    subColor:    "text-[#404040]",
    brand:       "text-[#282828]",
    closeBtn:    "text-[#444444] hover:text-[#888888] border border-[#1a1a1a] hover:border-[#333333]",
    dot:         "bg-[#408A71]",
    fab:         "bg-[#0a0a0a] border border-[#1a1a1a] text-[#686868] hover:text-[#b0b0b0] hover:border-[#3a3a3a]",
    fabIcon:     "#408A71",
    scrollThumb: "rgba(255,255,255,0.05)",
    typingDot:   "bg-[#333333]",
    shadow:      "shadow-[0_8px_40px_rgba(0,0,0,0.8)]",
  } : {
    panel:       "bg-[#f4f4f4] border border-[#e2e2e2]",
    header:      "border-b border-[#ebebeb]",
    aiBubble:    "bg-white border border-[#ebebeb] text-[#222222]",
    userBubble:  "bg-[#111111] text-white",
    inputBar:    "border-t border-[#ebebeb]",
    inputField:  "bg-white border border-[#e2e2e2] text-[#222222] placeholder-[#bbbbbb] focus:border-[#aaaaaa]",
    sendBtn:     "bg-[#111111] hover:bg-[#333333] text-white disabled:opacity-30 disabled:cursor-not-allowed",
    nameColor:   "text-[#0a0a0a]",
    subColor:    "text-[#aaaaaa]",
    brand:       "text-[#cccccc]",
    closeBtn:    "text-[#aaaaaa] hover:text-[#444444] border border-[#e2e2e2] hover:border-[#aaaaaa]",
    dot:         "bg-[#408A71]",
    fab:         "bg-[#f4f4f4] border border-[#d8d8d8] text-[#666666] hover:text-[#111111] hover:border-[#aaaaaa]",
    fabIcon:     "#111111",
    scrollThumb: "rgba(0,0,0,0.07)",
    typingDot:   "bg-[#cccccc]",
    shadow:      "shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
  };

  return (
    <>
      <style>{`
        .chatscroll::-webkit-scrollbar { width: 2px; }
        .chatscroll::-webkit-scrollbar-track { background: transparent; }
        .chatscroll::-webkit-scrollbar-thumb { background: ${g.scrollThumb}; border-radius: 99px; }
        .chatscroll { scrollbar-width: thin; scrollbar-color: ${g.scrollThumb} transparent; }
      `}</style>

      {/* ── Panel ──────────────────────────────────────────────────────────── */}
      <div
        className={`
          fixed right-4 sm:right-6 z-50
          w-[calc(100vw-2rem)] sm:w-[320px]
          rounded-sm overflow-hidden
          ${g.panel} ${g.shadow}
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-[0.97] pointer-events-none"}
        `}
        style={{ bottom: "56px", maxHeight: "min(520px, calc(100vh - 80px))", display: "flex", flexDirection: "column" }}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-3.5 py-2.5 ${g.header}`}>
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <img src={avatar} alt="Mark" className="w-7 h-7 rounded-sm object-cover" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${g.dot}`} />
            </div>
            <div>
              <p className={`text-[11px] font-semibold tracking-tight leading-tight ${g.nameColor}`}>
                Mark's Assistant
              </p>
              <p className={`text-[9px] tracking-[0.1em] uppercase ${g.subColor}`}>AI · Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-sm transition-all ${g.closeBtn}`}
            aria-label="Close"
          >
            <ChevronDown size={11} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 chatscroll"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {msg.role === "assistant" && (
                <img src={avatar} alt="Mark" className="w-5 h-5 rounded-sm object-cover flex-shrink-0 mb-0.5" />
              )}

              <div
                className={`
                  max-w-[80%] px-3 py-2 text-[11px] leading-relaxed rounded-sm
                  ${msg.role === "user" ? g.userBubble : g.aiBubble}
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <img src={avatar} alt="Mark" className="w-5 h-5 rounded-sm object-cover flex-shrink-0" />
              <div className={`px-3 py-2.5 rounded-sm ${g.aiBubble}`}>
                <div className="flex items-center gap-1">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className={`w-1 h-1 rounded-full animate-bounce ${g.typingDot}`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-3 pb-3 pt-2.5 ${g.inputBar}`}>
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask something…"
              disabled={isLoading}
              className={`
                flex-1 px-2.5 py-1.5 rounded-sm text-[11px] outline-none
                transition-all duration-150
                ${g.inputField}
              `}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-150 ${g.sendBtn}`}
            >
              {isLoading ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
            </button>
          </div>
          <p className={`text-[8px] text-center mt-2 tracking-[0.2em] uppercase ${g.brand}`}>
            Powered by Mark AI
          </p>
        </div>
      </div>

      {/* ── FAB ──────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Toggle chat"
        className={`
          fixed bottom-5 right-4 sm:right-6 z-50
          flex items-center gap-1.5
          px-3 py-1.5 rounded-sm
          text-[11px] font-medium
          transition-all duration-200
          ${g.fab}
        `}
      >
        {isOpen ? (
          <>
            <X size={11} />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageSquare size={11} color={g.fabIcon} />
            <span>Ask about Mark</span>
          </>
        )}
      </button>
    </>
  );
};

export default ChatBot;
