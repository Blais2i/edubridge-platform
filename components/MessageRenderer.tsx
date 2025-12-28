import React from "react";

interface MessageRendererProps {
  content: string;
}

export default function MessageRenderer({ content }: MessageRendererProps) {
  // Process the content to handle formatting
  const processContent = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      // Skip empty lines
      if (!line.trim()) {
        return <div key={lineIndex} className="h-2" />;
      }

      // Handle numbered lists (1. 2. 3.)
      const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        return (
          <div key={lineIndex} className="mb-2 ml-4">
            <strong className="font-bold text-gray-900">
              {numberedMatch[1]}.
            </strong>{" "}
            {processBoldText(numberedMatch[2])}
          </div>
        );
      }

      // Handle bullet points (- or *)
      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        const bulletText = line.trim().substring(1).trim();
        return (
          <div key={lineIndex} className="mb-2 ml-4">
            • {processBoldText(bulletText)}
          </div>
        );
      }

      // Regular paragraph with bold support
      return (
        <p key={lineIndex} className="mb-3 leading-relaxed">
          {processBoldText(line)}
        </p>
      );
    });
  };

  // Helper to process bold text **text** -> <strong>text</strong>
  const processBoldText = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }

      parts.push(
        <strong key={match.index} className="font-bold text-gray-900">
          {match[1]}
        </strong>
      );

      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="message-content font-sans">
      {processContent(content)}
    </div>
  );
}
