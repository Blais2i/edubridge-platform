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
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">

        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block md:col-span-3">
          <Sidebar
            activeConversationId={activeConversation}
            onSelectConversation={(id: string) => setActiveConversation(id)}
            onNewChat={() => {
              setActiveConversation(null);
              setRefreshKey((k) => k + 1);
            }}
            refreshKey={refreshKey}
          />
        </div>

        {/* Chat — full width on mobile */}
        <div className="col-span-12 md:col-span-9">
          <ChatInterface
            conversationIdProp={activeConversation}
            onConversationCreated={(id: string | null) => setActiveConversation(id)}
          />
        </div>

      </div>
    </div>
  );
}
