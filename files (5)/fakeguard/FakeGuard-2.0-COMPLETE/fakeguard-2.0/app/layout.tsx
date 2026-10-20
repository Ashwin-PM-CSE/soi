import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FakeGuard 2.0 | AI-Powered Misinformation Detection",
  description: "Next-generation AI-powered fake news detection platform with real-time credibility analysis, bias detection, and intelligent verification.",
  keywords: "fake news detection, AI, misinformation, fact checking, credibility analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
