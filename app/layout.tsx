import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Ananya // Level 20",
  description: "A classified birthday mission for Agent Ananya.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
