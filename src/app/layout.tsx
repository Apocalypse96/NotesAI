import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/lib/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotesAI - Smart Note Taking App",
  description: "AI-powered note taking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23888888' fill-opacity='0.02' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
        }}
      >
        <ReactQueryProvider>
          <Navbar />
          <main className="container mx-auto py-4">{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
