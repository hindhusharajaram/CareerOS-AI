import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, User, Sparkles, Clock, MessageSquare } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIChatMessage } from '../services/aiService';

const promptSuggestions = [
  'How can I improve my Career Score?',
  'What skills should I learn for Software Engineering?',
  'Review my ATS resume score and give tips',
  'How do I prepare for a Google interview?',
  'What are the most in-demand tech skills in 2026?',
  'Create a 30-day study plan for System Design',
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="chat-bubble-ai px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-indigo-400 animate-typing"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.senderRole === 'USER';
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end gap-3 animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
        isUser ? 'bg-slate-700' : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
      }`}>
        {isUser ? <User className="h-4 w-4 text-slate-300" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 text-sm leading-relaxed ${isUser ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-slate-200'}`}>
          {message.messageText}
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] text-slate-600 ${isUser ? 'flex-row-reverse' : ''}`}>
          <Clock className="h-2.5 w-2.5" />
          {time}
        </div>
      </div>
    </div>
  );
}

export default function AiCareerChatPage(): React.ReactElement {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const list = await aiService.getChatMessages();
      setMessages(list);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleSend = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || isSending) return;
    setInput('');
    setIsSending(true);

    const tempUserMsg: AIChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: 'session',
      senderRole: 'USER',
      messageText: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const aiMsg = await aiService.sendChatMessage(userText);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) { console.error(err); }
    finally { setIsSending(false); }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">AI Career Chat</h2>
              <p className="text-xs text-slate-500">Grounded in your profile, skills, ATS score & career targets</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI Active
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-3xl p-6 overflow-y-auto scrollable space-y-5 mb-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <p className="text-sm text-slate-500">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Start a Career Conversation</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-8">
                Ask the AI about your career score, resume tips, skill gaps, interview prep, or anything career-related.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {promptSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/8 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
              {isSending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0">
          {/* Suggestion chips (when messages exist) */}
          {messages.length > 0 && !isSending && (
            <div className="flex gap-2 mb-3 overflow-x-auto scrollable pb-1">
              {promptSuggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/40 hover:text-indigo-300 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="relative">
            <input
              type="text"
              placeholder="Ask about your career score, resume, skill gaps, interviews..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-4 pl-5 pr-14 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xl disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="absolute right-2.5 top-2.5 h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-700 mt-2">
            AI responses are grounded in your verified profile data. Scope-guarded.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
