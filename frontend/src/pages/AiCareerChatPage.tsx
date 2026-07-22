import React, { useEffect, useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIChatMessage } from '../services/aiService';

export default function AiCareerChatPage(): React.ReactElement {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const list = await aiService.getChatMessages();
      setMessages(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistic User Message
    const tempUserMsg: AIChatMessage = {
      id: Date.now().toString(),
      sessionId: 'session',
      senderRole: 'USER',
      messageText: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const aiMsg = await aiService.sendChatMessage(userText);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
        {/* Header */}
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              AI Career Copilot Chat
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Grounded in candidate profile, skills, ATS score, and career targets</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Scope Guardrails Active
          </span>
        </div>

        {/* Chat History View */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-4 backdrop-blur-md">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Bot className="h-12 w-12 opacity-40" />
              <p className="text-sm font-semibold">Start a career conversation with AI Copilot!</p>
              <p className="text-xs text-slate-600">Ask about score improvements, ATS resume advice, or interview prep.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${m.senderRole === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {m.senderRole === 'AI' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-xl border ${
                    m.senderRole === 'USER'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950/80 text-slate-200 border-slate-800 shadow-sm'
                  }`}
                >
                  {m.messageText}
                </div>

                {m.senderRole === 'USER' && (
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            placeholder="Ask AI Copilot about career score, resume review, skill gaps, or mock interviews..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 pl-5 pr-14 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none backdrop-blur-md shadow-xl"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="absolute right-2 top-2 h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </StudentLayout>
  );
}
