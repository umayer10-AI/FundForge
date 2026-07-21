'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Copy, Loader2, Bot } from 'lucide-react';
import { aiApi } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { label: 'Generate Title', action: 'title', prompt: 'Generate 5 creative campaign titles for my crowdfunding campaign' },
  { label: 'Improve Story', action: 'improve', prompt: 'Improve this campaign story to make it more compelling and emotional' },
  { label: 'Suggest Rewards', action: 'rewards', prompt: 'Suggest reward ideas for my crowdfunding campaign' },
  { label: 'Marketing Tips', action: 'marketing', prompt: 'Give me marketing tips for my campaign' },
  { label: 'FAQ Generator', action: 'faq', prompt: 'Generate frequently asked questions for my campaign' },
];

export default function AIChatWidget() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm FundForge AI.\n\nI can help you create better crowdfunding campaigns, answer your questions, improve your campaign story, generate rewards, and much more.\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isLoading) inputRef.current?.focus();
  }, [isOpen, isLoading]);

  const handleSend = async (content?: string) => {
    const text = (content || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await aiApi.chat({ message: text, type: activeType });
      if (res.data?.success && res.data?.data?.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.response, timestamp: new Date() }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data?.message || 'Sorry, I could not process that request. Please try again.', timestamp: new Date() }]);
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.message;
      const errMsg = serverMsg || 'Network error. Please check your connection and try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg, timestamp: new Date() }]);
    }
    setIsLoading(false);
    setActiveType('chat');
  };

  const handleSuggestion = (s: typeof suggestions[0]) => {
    setActiveType(s.action);
    handleSend(s.prompt);
  };

  const copyMessage = async (content: string) => {
    try { await navigator.clipboard.writeText(content); } catch { /* ignore */ }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all hover:scale-105"
        aria-label="AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] glass rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/30 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">FundForge AI</p>
                  <p className="text-xs text-white/70">AI Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-[10px] opacity-50">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'assistant' && (
                        <button onClick={() => copyMessage(msg.content)} className="opacity-50 hover:opacity-100 transition-opacity">
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                      <span className="text-sm text-slate-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-slate-400 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s.action}
                      onClick={() => handleSuggestion(s)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl text-xs text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="input-field flex-1 text-sm !py-2.5"
                  disabled={isLoading}
                />
                <button type="submit" disabled={!input.trim() || isLoading} className="btn-primary !p-2.5 !rounded-2xl !min-w-0 disabled:opacity-30">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
