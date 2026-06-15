import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travellore",
  description: "A travel profile studio for logging places and shaping a traveler signature.",
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
