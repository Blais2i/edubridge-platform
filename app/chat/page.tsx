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
    <div className="flex h-screen bg-white sm:bg-linear-to-b sm:from-white sm:to-gray-50 overflow-hidden">

      {/* Left rail - Hidden on mobile, visible on desktop */}
      <div className="hidden sm:block">
        <SidebarRail
          onToggle={() => setSidebarOpen(true)}
          onNewChat={() => {
            setActiveConversationId(null);
            setChatInstanceKey((v) => v + 1);
            setRefreshSidebar((v) => v + 1);
          }}
        />
      </div>

      {/* Full sidebar overlay on mobile, side panel on desktop */}
      {sidebarOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed sm:relative inset-y-0 left-0 w-80 sm:w-64 bg-slate-900 text-white p-4 sm:p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out">
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
        </>
      )}

      {/* Chat area - Full screen on mobile */}
      <div className="flex-1 flex flex-col p-0 sm:p-6 overflow-hidden">
        {/* Mobile header with hamburger */}
        <div className="sm:hidden flex items-center gap-3 p-3 bg-white border-b sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => {
              setActiveConversationId(null);
              setChatInstanceKey((v) => v + 1);
              setRefreshSidebar((v) => v + 1);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="New chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

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