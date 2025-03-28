"use client"
import localFont from "next/font/local";

import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import Footer from "./dashboard/_components/Footer";
import Header from "./dashboard/_components/Header";
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { ThemeProvider } from "@/app/context/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
const geistSans = localFont({
  
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ['system-ui', 'arial', 'sans-serif']
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  fallback: ['Courier New', 'monospace']
});

const metadata = {
  metadataBase: new URL('https://egeeksglobal.com'),
  title: {
    default: 'Mock Interview Project - AI-Powered Interview Preparation',
    template: '%s | Mock Interview AI'
  },
  description: 'Elevate your interview skills with AI-powered mock interviews. Get personalized coaching, real-time feedback, and boost your confidence.',
  keywords: [
    'AI interview preparation', 
    'mock interviews', 
    'interview coaching', 
    'career development', 
    'job interview help'
  ],
  authors: [{ name: 'Mock Interview AI Team' }],
  creator: 'Mock Interview AI',
  publisher: 'Mock Interview AI',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://mockinterview.com',
    title: 'Mock Interview AI - AI-Powered Interview Preparation',
    description: 'Elevate your interview skills with AI-powered mock interviews. Get personalized coaching, real-time feedback, and boost your confidence.',
    siteName: 'Mock Interview AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mock Interview AI - Revolutionizing Interview Preparation'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Mock Interview AI - AI-Powered Interview Preparation',
    description: 'Elevate your interview skills with AI-powered mock interviews. Get personalized coaching, real-time feedback, and boost your confidence.',
    creator: '@Name',
    images: ['/twitter-image.png']
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  
  verification: {
    google: 'your-google-site-verification-code',
    // Add other verification codes as needed
  }
};

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
    <ClerkProvider>
      <html 
        lang="en" 
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <body 
          className={`
            antialiased 
            min-h-screen 
            flex 
            flex-col 
            bg-white 
            text-gray-900 
            font-sans
          `}
        >
          <ThemeProvider>
            <a 
              href="#main-content" 
              className="
                absolute 
                top-[-999px] 
                left-[-999px] 
                z-[-1] 
                focus:top-0 
                focus:left-0 
                focus:z-50 
                p-4 
                bg-indigo-600 
                text-white
              "
            >
              Skip to main content
            </a>
            
            <Header />
            <Toaster />
            
            <main 
              id="main-content"
            >
              {children}
            </main>
            
            <Footer />

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    </QueryClientProvider>
  );
}