import type { Metadata } from 'next';
import { Zalando_Sans_Expanded, Google_Sans_Flex } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: '--font-zalando-sans-expanded',
  subsets: ['latin'],
});

const googleSansFlex = Google_Sans_Flex({
  variable: '--font-google-sans-flex',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Valo - Validate Your Ideas',
  description: 'Get AI-powered market insights and community feedback for your business ideas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider waitlistUrl='/'>
      <html lang='en'>
        <body className={`${zalandoSansExpanded.variable} ${googleSansFlex.variable} antialiased`}>
          <main className='min-h-dvh'>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
