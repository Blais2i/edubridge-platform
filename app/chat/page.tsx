"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import SidebarRail from "@/components/SidebarRail";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [chatInstanceKey, setChatInstanceKey] = useState(0);

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Left rail (always visible) */}
      <SidebarRail
        onToggle={() => setSidebarOpen(true)}
        onNewChat={() => {
          setActiveConversationId(null);
          setChatInstanceKey((v) => v + 1);
          setRefreshSidebar((v) => v + 1);
        }}
      />

      {/* Full sidebar (only when open) */}
      {sidebarOpen && (
        <div className="w-64 bg-slate-900 text-white p-6 overflow-y-auto">
          <Sidebar
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              setActiveConversationId(id);
              setSidebarOpen(false);
            }}
            onNewChat={() => {
              setActiveConversationId(null);
              setChatInstanceKey((v) => v + 1);
              setRefreshSidebar((v) => v + 1);
              setSidebarOpen(false);
            }}
            refreshKey={refreshSidebar}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <ChatInterface
          key={chatInstanceKey}
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
