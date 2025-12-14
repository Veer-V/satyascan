import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chat } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';

const LuciLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="luci_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00E5FF" />
        <stop offset="1" stopColor="#7C4DFF" />
      </linearGradient>
    </defs>
    {/* Base Circle */}
    <circle cx="50" cy="50" r="50" fill="url(#luci_grad)" />
    {/* Eyes */}
    <ellipse cx="35" cy="45" rx="6" ry="8" fill="#081028" />
    <ellipse cx="65" cy="45" rx="6" ry="8" fill="#081028" />
    {/* Shine in eyes */}
    <circle cx="37" cy="42" r="2" fill="white" opacity="0.8" />
    <circle cx="67" cy="42" r="2" fill="white" opacity="0.8" />
    {/* Smile */}
    <path d="M 35 65 Q 50 75 65 65" stroke="#081028" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Antenna */}
    <path d="M 50 15 L 50 0" stroke="url(#luci_grad)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="0" r="5" fill="#00E5FF" />
  </svg>
);

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "Hi! I'm LUCI! 💖 I can help you check ingredients or spot fakes. Ask me anything about beauty!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    try {
      chatSessionRef.current = createChatSession();
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Oops! I couldn't think of a response. 💄",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oh no! My connection to the beauty cloud broke! ☁️ Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-neon to-pink-500 rounded-full shadow-[0_0_20px_rgba(124,77,255,0.5)] z-50 flex items-center justify-center border-2 border-white/20 hover:scale-110 transition-transform overflow-visible"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <span className="text-xl md:text-2xl">✕</span>
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 p-0.5">
            <LuciLogo className="w-full h-full" />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-8 w-[calc(100vw-32px)] sm:w-80 md:w-96 h-[450px] md:h-[500px] bg-[#0b1221]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neon/20 to-pink-500/20 p-3 md:p-4 flex items-center gap-3 border-b border-white/5">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 bg-white/5 p-1">
                  <LuciLogo className="w-full h-full" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-[#0b1221]"></div>
              </div>
              <div>
                <h3 className="font-mono font-bold text-white tracking-wide text-sm md:text-base">LUCI</h3>
                <p className="text-[9px] md:text-[10px] text-pink-300 uppercase tracking-widest">Cosmetic Intelligence</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-2.5 md:p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-neon/20 text-white rounded-tr-none border border-neon/30' 
                        : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about makeup..."
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm text-white focus:outline-none focus:border-neon/50 placeholder-white/30"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-neon/20 hover:bg-neon/40 text-neon border border-neon/50 rounded-xl px-3 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <span className="text-base md:text-xl">➤</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;