import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // Ensure this matches your actual deployed domain
  metadataBase: new URL('https://mycv.guru'), 
  title: 'MyCV.guru - Create Professional Resumes Online',
  description: 'Build ATS-friendly resumes in minutes with our professional builder. Download PDF instantly.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg', // For iPhone home screen
  },
  openGraph: {
    title: 'MyCV.guru - Professional Resume Maker',
    description: 'Create your perfect resume today.',
    url: 'https://mycv.guru',
    siteName: 'MyCV.guru',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}