"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import { useUser } from "@/app/context/UserContext";

export default function ChatPage() {
  const { user, loading } = useUser();

  // Active conversation (null = idle / new chat)
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  // Used to force sidebar refresh when needed
  const [refreshKey, setRefreshKey] = useState(0);

  // NEW: mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Please sign in</h2>
          <p className="text-sm text-gray-500">
            Go to the home page to register or login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col">
      
      {/* Top bar with mobile menu button */}
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">

        {/* Sidebar (desktop + mobile overlay handled internally) */}
        <Sidebar
          activeConversationId={activeConversation}
          onSelectConversation={(id: string) => setActiveConversation(id)}
          onNewChat={() => {
            setActiveConversation(null);
            setRefreshKey((k) => k + 1);
          }}
          refreshKey={refreshKey}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Chat area */}
        <div className="flex-1">
          <ChatInterface
            conversationIdProp={activeConversation}
            onConversationCreated={(id: string | null) => setActiveConversation(id)}
          />
        </div>

      </div>
    </div>
  );
}
