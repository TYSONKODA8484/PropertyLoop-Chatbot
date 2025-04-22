// src/components/QuickReplies.tsx
import React from 'react';
import { QuickReply } from './types';

interface QuickRepliesProps {
  replies: QuickReply[];
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {replies.map((reply) => (
        <button
          key={reply.id}
          onClick={reply.action}
          className="bg-white hover:bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-full border border-gray-200 transition-colors duration-200"
        >
          {reply.text}
        </button>
      ))}
    </div>
  );
};
