// components/ChatInterface.tsx
'use client';

import { useState } from 'react'; // ADD THIS IMPORT

interface ChatInterfaceProps {
  selectedSubject: string;
}

export default function ChatInterface({ selectedSubject }: ChatInterfaceProps) {
  // ADD THUSE STATE HOOKS
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Muraho! I'm here to help you with your homework. Ask me anything!", isUser: false }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { text: message, isUser: true }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: "Ndashaka kugufasha! Let me explain this concept in Kinyarwanda first...", 
        isUser: false 
      }]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Learning Assistant</h2>
            <p className="text-gray-600">Ask questions in Kinyarwanda or English</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">AI Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.isUser
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area - MOBILE OPTIMIZED */}
      <div className="p-4 border-t">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Send
          </button>
        </div>
        
        {/* Quick Questions - Scrollable on mobile */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {["What is photosynthesis?", "Calculate area", "Explain fractions"].map((q, i) => (
              <button
                key={i}
                onClick={() => setMessage(q)}
                className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        
        {/* Voice Input */}
        <div className="mt-4 text-center">
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <span>🎤</span>
            <span>Speak Your Question</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">Click to record in Kinyarwanda or English</p>
        </div>
      </div>
    </div>
  );
}