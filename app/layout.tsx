import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import LearningCompanion from '@/app/learning-companion';
import './globals.css';
import './premium.css';
import './visual-polish.css';
import './flat-learning.css';
import './favourites.css';
import './course-marks.css';
import './home-hero.css';
import './learning-companion.css';
import './modern-nav.css';
import './learning-system.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteTitle = 'AISG My Courses';
const siteDescription = 'Professional learning for AISG — learn, check, apply and reflect.';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <LearningCompanion />
      </body>
    </html>
  );
}
