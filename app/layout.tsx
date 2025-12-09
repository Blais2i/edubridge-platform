import "./globals.css";
import { UserProvider } from "./lib/user-context";

export const metadata = {
  title: "BlaiseAI",
  description: "AI study assistant for East Africa"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
