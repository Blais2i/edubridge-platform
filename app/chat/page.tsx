"use client";

import { Suspense } from "react";
import ChatPageContent from "./ChatPageContent";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading chat…</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
