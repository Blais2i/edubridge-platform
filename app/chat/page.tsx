"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [chatInstanceKey, setChatInstanceKey] = useState(0); // forces ChatInterface re-mount on new chat

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 overflow-y-auto p-6">
        <Sidebar
  activeConversationId={activeConversationId}
  onSelectConversation={(id) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  }}
  onNewChat={() => {
    setActiveConversationId(null);
    setRefreshSidebar((v) => v + 1);
    setSidebarOpen(false);
  }}
  refreshKey={refreshSidebar}
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>

      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6">
        <ChatInterface
          key={chatInstanceKey} // ensures a clean slate on new chat
          conversationIdProp={activeConversationId}
          onConversationCreated={(id) => {
            setActiveConversationId(id);
            setRefreshSidebar((v) => v + 1);
          }}
        />
      </div>
    </div>
  );
}