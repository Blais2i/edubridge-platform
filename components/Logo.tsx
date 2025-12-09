// components/Logo.tsx
'use client';

import Image from 'next/image';

export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      <Image src="/blaise-ai-logo.png" alt="Blaise AI" width={size} height={size} style={{ objectFit: 'contain' }} />
    </div>
  );
}
