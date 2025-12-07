// File: app/layout.tsx (update this file)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/lib/user-context"; // ADD THIS IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduBridge Rwanda",
  description: "AI-powered homework help for Rwanda curriculum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider> {/* WRAP WITH USERPROVIDER */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}