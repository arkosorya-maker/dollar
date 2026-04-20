import type {Metadata} from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const ibm = IBM_Plex_Mono({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'DinarRate',
  description: 'Mobile currency tracker app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${ibm.variable}`}>
      <body className="font-sans text-[15px] bg-[#0D0D1A] text-white overflow-hidden text-[15px]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
