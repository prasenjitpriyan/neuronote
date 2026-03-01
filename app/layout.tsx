import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Neuronote',
    default: 'Neuronote - AI-Powered Note Taking',
  },
  description:
    'Write freely. AI automatically summarizes, tags, and indexes your notes without ever slowing you down. Built with Next.js, Prisma, and OpenAI.',
  keywords: [
    'notes',
    'ai',
    'summarizer',
    'markdown',
    'knowledge base',
    'productivity',
  ],
  authors: [{ name: 'Prasenjit Das' }],
  creator: 'Prasenjit Das',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Neuronote - AI-Powered Note Taking',
    description:
      'Write freely. AI automatically summarizes, tags, and indexes your notes without ever slowing you down.',
    url: '/',
    siteName: 'Neuronote',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neuronote - AI-Powered Note Taking',
    description:
      'Write freely. AI automatically summarizes, tags, and indexes your notes without ever slowing you down.',
    creator: '@prasenjit_priyan',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
