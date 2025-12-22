"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import { useUser } from "@/app/context/UserContext";

export default function ChatPage() {
  const { user, loading } = useUser();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ NEW: sidebar state
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
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Pass menu button control to TopBar later if you want */}
      <TopBar onMenuClick={() => setSidebarOpen(true)} />


      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <Sidebar
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setSidebarOpen(false); // close on mobile after selection
          }}
          onNewChat={() => {
            setActiveConversationId(null);
            setRefreshKey((k) => k + 1);
            setSidebarOpen(false);
          }}
          refreshKey={refreshKey}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Chat area */}
        <div className="flex-1">
          <ChatInterface
            conversationIdProp={activeConversationId}
            onConversationCreated={(id: string | null) =>
              setActiveConversationId(id)
            }
          />
        </div>
      </div>
    </div>
  );
}
