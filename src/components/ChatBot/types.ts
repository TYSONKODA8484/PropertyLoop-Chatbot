// src/components/types.ts

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: number;
  imageUrl?: string;
}

export interface QuickReply {
  id: string;
  text: string;
  action: () => void;
}