// components/MessageBubble.tsx
'use client';

export default function MessageBubble({ text, isUser }: { text: string; isUser: boolean }) {
  return (
    <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'ml-auto bg-white border border-gray-200' : 'bg-white border-2 border-cyan-200 shadow-sm'}`}>
      <div className="whitespace-pre-wrap text-sm text-gray-800">{text}</div>
    </div>
  );
}
