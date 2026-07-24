import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Navbar from '@/components/ui/Navbar'
import ToastContainer from '@/components/ui/Toast'
import React from 'react'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'CelebrateVerse — Create Magical Birthday Celebrations',
    template: '%s | CelebrateVerse',
  },
  description:
    'Create a cinematic, personalized birthday celebration in under 60 seconds. Share via link or QR code. Make someone feel truly special.',
  keywords: ['birthday', 'celebration', 'birthday page', 'birthday website', 'birthday surprise', 'animated birthday card'],
  authors: [{ name: 'CelebrateVerse' }],
  creator: 'CelebrateVerse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://celebrateverse.app',
    title: 'CelebrateVerse — Create Magical Birthday Celebrations',
    description: 'Create a cinematic, personalized birthday celebration in under 60 seconds.',
    siteName: 'CelebrateVerse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CelebrateVerse — Create Magical Birthday Celebrations',
    description: 'Create a cinematic birthday experience. Share with one link.',
    creator: '@celebrateverse',
  },
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#FF6B9D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-dark text-white antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
