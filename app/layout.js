import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import { Encode_Sans } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import { ComparisonProvider } from '@/context/ComparisonContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  variable: '--font-encode',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Dr. Cannabis Samen",
  description: "Your trusted source for cannabis seeds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${encodeSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-encode`}
      >
        <ComparisonProvider>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
        </ComparisonProvider>
      </body>
    </html>
  );
}
