import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Monster Overview",
  description: "Filter and view pocket monsters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
