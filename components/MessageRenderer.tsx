import React from "react";

interface MessageRendererProps {
  content: string;
}

export default function MessageRenderer({ content }: MessageRendererProps) {
  const lines = content.split("\n");

  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* -------- CODE BLOCK (tables, charts, diagrams) -------- */
    if (line.trim().startsWith("```")) {
      const blockLines: string[] = [];
      i++; // move past opening ```

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        blockLines.push(lines[i]);
        i++;
      }

      elements.push(
        <pre
          key={i}
          className="bg-gray-100 border border-gray-300 rounded-md p-3 my-3 text-sm font-mono whitespace-pre overflow-x-auto"
        >
          {blockLines.join("\n")}
        </pre>
      );

      i++; // skip closing ```
      continue;
    }

    /* -------- EMPTY LINE -------- */
    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    /* -------- NUMBERED LIST -------- */
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="mb-2 ml-4">
          <strong className="font-bold text-gray-900">
            {numberedMatch[1]}.
          </strong>{" "}
          {processBoldText(numberedMatch[2])}
        </div>
      );
      i++;
      continue;
    }

    /* -------- BULLET POINT -------- */
    if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
      const bulletText = line.trim().substring(1).trim();
      elements.push(
        <div key={i} className="mb-2 ml-4">
          • {processBoldText(bulletText)}
        </div>
      );
      i++;
      continue;
    }

    /* -------- NORMAL PARAGRAPH -------- */
    elements.push(
      <p key={i} className="mb-3 leading-relaxed">
        {processBoldText(line)}
      </p>
    );
    i++;
  }

  return <div className="message-content font-sans">{elements}</div>;
}

/* -------- BOLD TEXT PROCESSOR -------- */
function processBoldText(text: string): React.ReactNode {
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
}
