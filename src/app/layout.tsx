import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { HeaderBase } from '@/components/HeaderBase';
import { getServerSession } from 'next-auth';
import './globals.css';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CodeReview AI',
  description: 'An AI-powered code reviews application that analyzes source code and provides structured feedback on potential bugs, security issues, performance improvements, and code style.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          { session && <HeaderBase /> }
          <main className="flex-1 flex justify-center items-center">{ children }</main>
        </Providers>
      </body>
    </html>
  );
}
