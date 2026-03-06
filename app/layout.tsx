import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoreBet",
  description: "ScoreBet app powered by Vercel, Supabase and Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="antialiased">{children}</body>
    </html>
  );
}
