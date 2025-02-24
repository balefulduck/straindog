import { Geist, Geist_Mono } from "next/font/google";
import { Encode_Sans } from "next/font/google";
import { Dancing_Script } from 'next/font/google';
import "./globals.css";
import Header from '@/components/Header';
import { ComparisonProvider } from '@/context/ComparisonContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const encodeSans = Encode_Sans({
  variable: "--font-encode",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
});

export const metadata = {
  title: "Dr. Cannabis Samen",
  description: "Dr. Cannabis Experience Store Riegelsberg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${encodeSans.variable} ${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased font-encode`}
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
