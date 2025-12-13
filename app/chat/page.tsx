import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full">
          <Sidebar />
        </div>

        {/* Chat */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
