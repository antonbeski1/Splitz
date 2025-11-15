'use client';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ResultsProvider } from '@/context/ResultsContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ResultsProvider>
          {children}
        </ResultsProvider>
        <Toaster />
      </body>
    </html>
  );
}
