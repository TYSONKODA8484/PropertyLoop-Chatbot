// src/components/ChatMessage.tsx
import React from 'react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-[#00c2cb] text-white rounded-tr-none'
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Uploaded property"
            className="rounded-lg mb-2 max-w-full"
          />
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
