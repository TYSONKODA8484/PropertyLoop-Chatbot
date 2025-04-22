// src/components/ChatInput.tsx
import React, { useState, useRef } from 'react';
import { Camera, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onImageUpload: (file: File, message?: string) => void;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onImageUpload,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage || attachedImage) {
      if (attachedImage) {
        onImageUpload(attachedImage, trimmedMessage || undefined);
        setAttachedImage(null);
        setPreviewUrl(null);
      }
      if (!attachedImage && trimmedMessage) {
        onSendMessage(trimmedMessage);
      }
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 bg-white px-4 py-3 border-t border-gray-200 rounded-b-2xl ${className}`}
    >
      {previewUrl && (
        <div className="relative max-w-xs">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-xl max-h-32 object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => {
              setAttachedImage(null);
              setPreviewUrl(null);
            }}
            className="absolute top-1 right-1 bg-white rounded-full text-red-600 hover:text-red-800 p-1"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-black hover:text-gray-800 transition-colors"
        >
          <Camera size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-black text-sm text-black placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!message.trim() && !attachedImage}
          className="text-black hover:text-gray-800 transition-colors disabled:text-gray-400"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};
