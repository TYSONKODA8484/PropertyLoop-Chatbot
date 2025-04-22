// src/components/ChatBot.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Maximize2, X } from 'lucide-react';
import { Message, QuickReply } from './types';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import { ChatInput } from './ChatInput';
import { RefreshCw } from 'lucide-react'; // Add this at the top


const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  type: 'bot',
  content:
    'Hello! I can help you identify property issues from photos or answer your tenancy-related questions. What would you like help with?',
  timestamp: Date.now(),
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('text', content);

      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      const botMessage = {
        id: `bot-${Date.now()}`,
        content: data.reply,
        type: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          content: 'Oops! Something went wrong. Please try again.',
          type: 'bot',
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleImageUpload = async (file: File, message?: string) => {
    const imageUrl = URL.createObjectURL(file);
    const userImageMessage = {
      id: Date.now().toString(),
      content: message?.trim() || '📷 Image uploaded',
      type: 'user',
      timestamp: Date.now(),
      imageUrl,
    };
    setMessages((prev) => [...prev, userImageMessage]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (message?.trim()) {
        formData.append('text', message.trim());
      }

      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      const botMessage = {
        id: `bot-${Date.now()}`,
        content: data.reply,
        type: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          content: 'Oops! Couldn’t analyze the image. Try a different one.',
          type: 'bot',
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleLocationSelect = () => {
    console.log('Location selection requested');
  };

  const handleExpand = () => {
    console.log('Expand to full screen demo');
  };

  const handleResetChat = async () => {
    await fetch('http://localhost:5000/reset', { method: 'POST' });
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(true)}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-xl`}
      >
        <MessageSquare size={20} />
        <span className="text-sm font-medium">Chat with us</span>
      </button>

      {isOpen && (
        <div className="flex flex-col bg-white rounded-2xl shadow-2xl w-[400px] h-[620px] max-h-[80vh] border border-gray-300 animate-fade-in">
          <div className="flex items-center justify-between bg-white text-black px-5 py-3 border-b border-gray-200 rounded-t-2xl">
            <h2 className="font-semibold text-base">PropertyLoop Assistant</h2>
            <div className="flex items-center gap-2">
            <button onClick={handleResetChat} className="p-1 hover:text-red-500" title="Reset chat">
              <RefreshCw size={18} />
            </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:text-gray-600" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onImageUpload={handleImageUpload}
            onLocationSelect={handleLocationSelect}
            className="border-t border-gray-200 bg-white"
          />
        </div>
      )}
    </div>
  );
};
