"use client";

import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

export default function ChatPage() {
  const { user, loading } = useUser();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access Blaise AI</p>
          <a 
            href="/login"
            className="bg-gradient-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (id: string) => {
    console.log("Selected conversation:", id);
    setCurrentConversationId(id);
    
    if (id === "new") {
      console.log("Starting new chat");
      setCurrentConversationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header - Like in second picture */}
      <div className="bg-gradient-purple text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="text-lg font-bold">AI</div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Blaise AI</h1>
              <p className="text-white/80 text-sm">Learning assistant • Kinyarwanda first</p>
            </div>
          </div>

          {/* Right side - User info */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 px-4 py-2">
              <span className="text-sm">{user?.email || "User"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Sidebar - 4 columns */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full">
            <Sidebar onSelect={handleSelectConversation} />
          </div>

          {/* Chat Interface - 8 columns */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
            <ChatInterface 
              conversationIdProp={currentConversationId}
              onConversationCreated={(id: string) => {
                console.log("New conversation created:", id);
                setCurrentConversationId(id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}