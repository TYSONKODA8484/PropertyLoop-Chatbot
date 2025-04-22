import React from 'react';
import { ChatBot } from './components/ChatBot/ChatBot';

function App() {
  return (
    // 1) Make this container exactly the viewport height and scrollable
    <div className="relative h-screen overflow-auto">
      {/* 2) Your full‑page screenshot as an <img> so it scrolls with the container */}
      <img
        src="/fullpage.png"
        alt="PropertyLoop Full Page"
        className="w-full block"
      />

      {/* 3) ChatBot is fixed via its own CSS (bottom-4 right-4 z-50) */}
      <ChatBot />
    </div>
  );
}

export default App;
