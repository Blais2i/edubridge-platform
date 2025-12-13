import "./globals.css";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "BlaiseAI",
  description: "AI study assistant for East Africa"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
