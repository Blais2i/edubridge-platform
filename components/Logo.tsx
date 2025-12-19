// components/Logo.tsx
'use client';

import Image from 'next/image';

export default function Logo({
  size = 48,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ width: size, height: size }}
      className="relative focus:outline-none"
    >
      <Image
        src="/blaise-ai-logo.png"
        alt="Blaise AI"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </button>
  );
}
