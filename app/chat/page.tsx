"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  const [refreshSidebar, setRefreshSidebar] = useState(0);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Sidebar
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewChat={() => setActiveConversationId(null)}
            refreshKey={refreshSidebar}
          />
        </div>

        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <ChatInterface
            conversationIdProp={activeConversationId}
            onConversationCreated={(id) => {
              setActiveConversationId(id);
              setRefreshSidebar((v) => v + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
